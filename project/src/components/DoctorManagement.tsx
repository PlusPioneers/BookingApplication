import React, { useState } from 'react';
import { Plus, Edit3, Trash2, User, Phone, Mail, Clock, ToggleLeft, ToggleRight, Settings } from 'lucide-react';
import { Doctor, TimeSlot } from '../types';

interface DoctorManagementProps {
  doctors: Doctor[];
  onAddDoctor: (doctor: Doctor) => void;
  onUpdateDoctor: (id: string, updates: Partial<Doctor>) => void;
  onDeleteDoctor: (id: string) => void;
}

const DoctorManagement: React.FC<DoctorManagementProps> = ({
  doctors,
  onAddDoctor,
  onUpdateDoctor,
  onDeleteDoctor
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [editingTimeSlots, setEditingTimeSlots] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    phone: '',
    email: ''
  });

  const [timeSlotsData, setTimeSlotsData] = useState<TimeSlot[]>([]);

  const defaultTimeSlots: TimeSlot[] = [
    { id: '1', startTime: '09:00', endTime: '09:30', dayOfWeek: 1, isAvailable: true },
    { id: '2', startTime: '09:30', endTime: '10:00', dayOfWeek: 1, isAvailable: true },
    { id: '3', startTime: '10:00', endTime: '10:30', dayOfWeek: 1, isAvailable: true },
    { id: '4', startTime: '10:30', endTime: '11:00', dayOfWeek: 1, isAvailable: true },
    { id: '5', startTime: '14:00', endTime: '14:30', dayOfWeek: 1, isAvailable: true },
    { id: '6', startTime: '14:30', endTime: '15:00', dayOfWeek: 1, isAvailable: true },
    { id: '7', startTime: '15:00', endTime: '15:30', dayOfWeek: 1, isAvailable: true },
    { id: '8', startTime: '15:30', endTime: '16:00', dayOfWeek: 1, isAvailable: true }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingDoctor) {
      onUpdateDoctor(editingDoctor.id, formData);
      setEditingDoctor(null);
    } else {
      const newDoctor: Doctor = {
        id: Date.now().toString(),
        ...formData,
        isActive: true,
        availableSlots: defaultTimeSlots,
        createdAt: new Date()
      };
      onAddDoctor(newDoctor);
      setShowAddForm(false);
    }
    
    setFormData({ name: '', specialization: '', phone: '', email: '' });
  };

  const handleEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name,
      specialization: doctor.specialization,
      phone: doctor.phone,
      email: doctor.email
    });
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingDoctor(null);
    setFormData({ name: '', specialization: '', phone: '', email: '' });
  };

  const toggleDoctorStatus = (doctorId: string, currentStatus: boolean) => {
    onUpdateDoctor(doctorId, { isActive: !currentStatus });
  };

  const handleEditTimeSlots = (doctor: Doctor) => {
    setEditingTimeSlots(doctor.id);
    setTimeSlotsData([...doctor.availableSlots]);
  };

  const addTimeSlot = () => {
    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      startTime: '09:00',
      endTime: '09:30',
      dayOfWeek: 1,
      isAvailable: true
    };
    setTimeSlotsData([...timeSlotsData, newSlot]);
  };

  const updateTimeSlot = (slotId: string, updates: Partial<TimeSlot>) => {
    setTimeSlotsData(slots => 
      slots.map(slot => slot.id === slotId ? { ...slot, ...updates } : slot)
    );
  };

  const deleteTimeSlot = (slotId: string) => {
    setTimeSlotsData(slots => slots.filter(slot => slot.id !== slotId));
  };

  const saveTimeSlots = () => {
    if (editingTimeSlots) {
      onUpdateDoctor(editingTimeSlots, { availableSlots: timeSlotsData });
      setEditingTimeSlots(null);
      setTimeSlotsData([]);
    }
  };

  const cancelTimeSlotEdit = () => {
    setEditingTimeSlots(null);
    setTimeSlotsData([]);
  };

  const getDayName = (dayOfWeek: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayOfWeek];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Doctor Management</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Doctor
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
          </h3>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Specialization
              </label>
              <input
                type="text"
                required
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="md:col-span-2 flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingDoctor ? 'Update Doctor' : 'Add Doctor'}
              </button>
            </div>
          </form>
        </div>
      )}

      {editingTimeSlots && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Edit Time Slots</h3>
          
          <div className="space-y-4">
            {timeSlotsData.map((slot) => (
              <div key={slot.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center p-4 border border-gray-200 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
                  <select
                    value={slot.dayOfWeek}
                    onChange={(e) => updateTimeSlot(slot.id, { dayOfWeek: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    {[0, 1, 2, 3, 4, 5, 6].map(day => (
                      <option key={day} value={day}>{getDayName(day)}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={slot.startTime}
                    onChange={(e) => updateTimeSlot(slot.id, { startTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={slot.endTime}
                    onChange={(e) => updateTimeSlot(slot.id, { endTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Available</label>
                  <select
                    value={slot.isAvailable ? 'true' : 'false'}
                    onChange={(e) => updateTimeSlot(slot.id, { isAvailable: e.target.value === 'true' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <button
                    onClick={() => deleteTimeSlot(slot.id)}
                    className="w-full px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                  >
                    Delete Slot
                  </button>
                </div>
              </div>
            ))}
            
            <div className="flex justify-between items-center pt-4">
              <button
                onClick={addTimeSlot}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Time Slot
              </button>
              
              <div className="flex space-x-3">
                <button
                  onClick={cancelTimeSlotEdit}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveTimeSlots}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Time Slots
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Available Slots
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {doctors.map((doctor) => (
                <tr key={doctor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="w-8 h-8 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {doctor.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {doctor.specialization}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center mb-1">
                      <Phone className="w-3 h-3 mr-1" />
                      {doctor.phone}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Mail className="w-3 h-3 mr-1" />
                      {doctor.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleDoctorStatus(doctor.id, doctor.isActive)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                        doctor.isActive 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {doctor.isActive ? (
                        <ToggleRight className="w-3 h-3 mr-1" />
                      ) : (
                        <ToggleLeft className="w-3 h-3 mr-1" />
                      )}
                      {doctor.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Clock className="w-4 h-4 mr-1" />
                      {doctor.availableSlots.filter(slot => slot.isAvailable).length} slots
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditTimeSlots(doctor)}
                        className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50"
                        title="Edit Time Slots"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(doctor)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="Edit Doctor"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteDoctor(doctor.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        title="Delete Doctor"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DoctorManagement;