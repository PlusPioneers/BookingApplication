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

  const generateTimeSlots = (dayOfWeek: number, startTime: string, endTime: string) => {
    const slots: TimeSlot[] = [];
    const start = new Date(`2000-01-01T${startTime}:00`);
    const end = new Date(`2000-01-01T${endTime}:00`);
    
    let current = new Date(start);
    let slotId = Date.now();
    
    while (current < end) {
      const next = new Date(current.getTime() + 30 * 60000); // Add 30 minutes
      if (next <= end) {
        slots.push({
          id: (slotId++).toString(),
          startTime: current.toTimeString().slice(0, 5),
          endTime: next.toTimeString().slice(0, 5),
          dayOfWeek,
          isAvailable: true,
          isBreak: false
        });
      }
      current = next;
    }
    
    return slots;
  };

  const addTimeFrame = (dayOfWeek: number, startTime: string, endTime: string) => {
    if (!startTime || !endTime) return;
    
    const newSlots = generateTimeSlots(dayOfWeek, startTime, endTime);
    
    // Remove existing slots for the same day and time range to avoid conflicts
    const filteredSlots = timeSlotsData.filter(slot => {
      if (slot.dayOfWeek !== dayOfWeek) return true;
      
      const slotStart = new Date(`2000-01-01T${slot.startTime}:00`);
      const slotEnd = new Date(`2000-01-01T${slot.endTime}:00`);
      const frameStart = new Date(`2000-01-01T${startTime}:00`);
      const frameEnd = new Date(`2000-01-01T${endTime}:00`);
      
      // Keep slot if it doesn't overlap with the new frame
      return slotEnd <= frameStart || slotStart >= frameEnd;
    });
    
    setTimeSlotsData([...filteredSlots, ...newSlots]);
  };

  const toggleSlotType = (slotId: string) => {
    setTimeSlotsData(slots => 
      slots.map(slot => 
        slot.id === slotId 
          ? { ...slot, isBreak: !slot.isBreak, isAvailable: slot.isBreak ? true : false }
          : slot
      )
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
          <h3 className="text-lg font-semibold mb-6">Manage Doctor Schedule</h3>
          
          {/* Add Time Frame Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="text-md font-medium text-blue-900 mb-4">Add Working Hours</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
                <select
                  id="daySelect"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  defaultValue="1"
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
                  id="startTimeInput"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  defaultValue="09:00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                <input
                  type="time"
                  id="endTimeInput"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  defaultValue="17:00"
                />
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={() => {
                    const daySelect = document.getElementById('daySelect') as HTMLSelectElement;
                    const startInput = document.getElementById('startTimeInput') as HTMLInputElement;
                    const endInput = document.getElementById('endTimeInput') as HTMLInputElement;
                    
                    if (daySelect && startInput && endInput) {
                      addTimeFrame(parseInt(daySelect.value), startInput.value, endInput.value);
                    }
                  }}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Generate Slots
                </button>
              </div>
            </div>
            <p className="text-sm text-blue-700 mt-2">
              This will create 30-minute time slots for the selected time frame. Existing slots in this time range will be replaced.
            </p>
          </div>

          {/* Current Schedule Display */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-900">Current Schedule</h4>
            
            {[0, 1, 2, 3, 4, 5, 6].map(dayOfWeek => {
              const daySlots = timeSlotsData
                .filter(slot => slot.dayOfWeek === dayOfWeek)
                .sort((a, b) => a.startTime.localeCompare(b.startTime));
              
              if (daySlots.length === 0) return null;
              
              return (
                <div key={dayOfWeek} className="border border-gray-200 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-3">{getDayName(dayOfWeek)}</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {daySlots.map((slot) => (
                      <div
                        key={slot.id}
                        className={`p-2 rounded-md text-center text-sm border-2 cursor-pointer transition-colors ${
                          slot.isBreak
                            ? 'bg-orange-100 border-orange-300 text-orange-800'
                            : slot.isAvailable
                            ? 'bg-green-100 border-green-300 text-green-800'
                            : 'bg-gray-100 border-gray-300 text-gray-600'
                        }`}
                        onClick={() => toggleSlotType(slot.id)}
                        title={`Click to toggle between ${slot.isBreak ? 'available slot' : 'break time'}`}
                      >
                        <div className="font-medium">
                          {slot.startTime} - {slot.endTime}
                        </div>
                        <div className="text-xs mt-1">
                          {slot.isBreak ? 'Break' : slot.isAvailable ? 'Available' : 'Unavailable'}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={() => {
                        const updatedSlots = timeSlotsData.filter(slot => slot.dayOfWeek !== dayOfWeek);
                        setTimeSlotsData(updatedSlots);
                      }}
                      className="text-red-600 hover:text-red-800 text-sm px-2 py-1 rounded hover:bg-red-50"
                    >
                      Clear {getDayName(dayOfWeek)}
                    </button>
                  </div>
                </div>
              );
            })}
            
            {timeSlotsData.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>No time slots configured. Add working hours above to get started.</p>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="bg-gray-50 rounded-lg p-4 mt-6">
            <h5 className="font-medium text-gray-900 mb-2">Legend</h5>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded mr-2"></div>
                <span>Available for booking</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-orange-100 border-2 border-orange-300 rounded mr-2"></div>
                <span>Break time</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-100 border-2 border-gray-300 rounded mr-2"></div>
                <span>Unavailable</span>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Click on any time slot to toggle between available and break time.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
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
              Save Schedule
            </button>
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