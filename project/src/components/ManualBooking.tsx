import React, { useState, useMemo } from 'react';
import { Calendar, Clock, User, Phone, FileText } from 'lucide-react';
import { Doctor, Appointment, BookingFormData } from '../types';

interface ManualBookingProps {
  doctors: Doctor[];
  appointments: Appointment[];
  onAddAppointment: (appointment: Appointment) => void;
  rescheduleData?: Appointment | null;
  onCancelReschedule?: () => void;
}

const ManualBooking: React.FC<ManualBookingProps> = ({
  doctors,
  appointments,
  onAddAppointment,
  rescheduleData,
  onCancelReschedule
}) => {
  const [formData, setFormData] = useState<BookingFormData>({
    patientName: '',
    patientPhone: '',
    patientEmail: '',
    doctorId: '',
    date: '',
    time: '',
    reason: ''
  });

  // Initialize form with reschedule data if provided
  React.useEffect(() => {
    if (rescheduleData) {
      setFormData({
        patientName: rescheduleData.patientName,
        patientPhone: rescheduleData.patientPhone,
        patientEmail: rescheduleData.patientEmail || '',
        doctorId: rescheduleData.doctorId,
        date: rescheduleData.date,
        time: rescheduleData.time,
        reason: rescheduleData.reason
      });
    }
  }, [rescheduleData]);

  const activeDoctors = useMemo(() => 
    doctors.filter(doctor => doctor.isActive), 
    [doctors]
  );

  const selectedDoctor = useMemo(() => 
    doctors.find(doc => doc.id === formData.doctorId),
    [doctors, formData.doctorId]
  );

  const availableTimeSlots = useMemo(() => {
    if (!selectedDoctor || !formData.date) return [];

    const selectedDate = new Date(formData.date);
    const dayOfWeek = selectedDate.getDay();
    
    // Get doctor's available slots for the selected day
    const doctorSlots = selectedDoctor.availableSlots.filter(
      slot => slot.dayOfWeek === dayOfWeek && slot.isAvailable && !slot.isBreak
    );

    // Filter out already booked slots
    const bookedSlots = appointments
      .filter(apt => apt.doctorId === formData.doctorId && apt.date === formData.date)
      .map(apt => apt.time);

    return doctorSlots.filter(slot => !bookedSlots.includes(slot.startTime));
  }, [selectedDoctor, formData.date, formData.doctorId, appointments]);

  const getNextAvailableSlot = () => {
    if (!selectedDoctor) return '';
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    // Find the next available slot today
    const todaySlots = availableTimeSlots.filter(slot => {
      const [hours, minutes] = slot.startTime.split(':').map(Number);
      const slotTime = hours * 60 + minutes;
      return slotTime > currentTime;
    });
    
    return todaySlots.length > 0 ? todaySlots[0].startTime : availableTimeSlots[0]?.startTime || '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const doctorName = selectedDoctor?.name || '';
    
    if (rescheduleData) {
      // Update existing appointment
      const updatedAppointment: Appointment = {
        ...rescheduleData,
        ...formData,
        doctorName,
        bookingStatus: 'upcoming',
        updatedAt: new Date()
      };
      onAddAppointment(updatedAppointment);
      onCancelReschedule?.();
      alert('Appointment rescheduled successfully!');
    } else {
      // Create new appointment
      const newAppointment: Appointment = {
        id: Date.now().toString(),
        ...formData,
        doctorName,
        bookingStatus: 'upcoming',
        followUpStatus: 'none',
        createdAt: new Date(),
        updatedAt: new Date(),
        bookedBy: 'staff'
      };
      onAddAppointment(newAppointment);
      alert('Appointment booked successfully!');
    }
    
    // Reset form
    setFormData({
      patientName: '',
      patientPhone: '',
      patientEmail: '',
      doctorId: '',
      date: '',
      time: '',
      reason: ''
    });
  };

  const handleDoctorChange = (doctorId: string) => {
    setFormData(prev => ({ ...prev, doctorId, time: '' }));
  };

  const handleDateChange = (date: string) => {
    setFormData(prev => ({ ...prev, date, time: '' }));
  };

  const setNearestTimeSlot = () => {
    const nearestSlot = getNextAvailableSlot();
    if (nearestSlot) {
      setFormData(prev => ({ ...prev, time: nearestSlot }));
    }
  };

  // Set today as default date
  React.useEffect(() => {
    if (!formData.date) {
      const today = new Date().toISOString().split('T')[0];
      setFormData(prev => ({ ...prev, date: today }));
    }
  }, [formData.date]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {rescheduleData ? 'Reschedule Appointment' : 'Manual Booking'}
          </h2>
          {rescheduleData && onCancelReschedule && (
            <button
              onClick={onCancelReschedule}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel Reschedule
            </button>
          )}
        </div>
        
        {rescheduleData && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-yellow-800 mb-2">Rescheduling Missed Appointment</h3>
            <p className="text-sm text-yellow-700">
              Original appointment: {rescheduleData.date} at {rescheduleData.time} with {rescheduleData.doctorName}
            </p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <User className="w-4 h-4 inline mr-1" />
                Patient Name *
              </label>
              <input
                type="text"
                required
                value={formData.patientName}
                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter patient's full name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Phone className="w-4 h-4 inline mr-1" />
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={formData.patientPhone}
                onChange={(e) => setFormData({ ...formData, patientPhone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address (Optional)
            </label>
            <input
              type="email"
              value={formData.patientEmail}
              onChange={(e) => setFormData({ ...formData, patientEmail: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter email address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Doctor *
            </label>
            <select
              required
              value={formData.doctorId}
              onChange={(e) => handleDoctorChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Choose a doctor</option>
              {activeDoctors.map(doctor => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name} - {doctor.specialization}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => handleDateChange(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Clock className="w-4 h-4 inline mr-1" />
                Time *
              </label>
              <div className="flex space-x-2">
                <select
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  disabled={!formData.doctorId || !formData.date}
                >
                  <option value="">Select time</option>
                  {availableTimeSlots.map(slot => (
                    <option key={slot.id} value={slot.startTime}>
                      {slot.startTime} - {slot.endTime}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={setNearestTimeSlot}
                  disabled={!formData.doctorId || !formData.date}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Nearest
                </button>
              </div>
              {availableTimeSlots.length === 0 && formData.doctorId && formData.date && (
                <p className="text-red-600 text-sm mt-1">No available slots for this date</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FileText className="w-4 h-4 inline mr-1" />
              Reason for Visit *
            </label>
            <textarea
              required
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe the reason for the appointment"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            {rescheduleData ? 'Reschedule Appointment' : 'Book Appointment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManualBooking;