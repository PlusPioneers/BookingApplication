import React, { useState, useMemo } from 'react';
import { Calendar, Clock, User, Phone, Mail, FileText, CheckCircle } from 'lucide-react';
import { Doctor, Appointment, BookingFormData } from '../types';

interface CustomerBookingProps {
  doctors: Doctor[];
  appointments: Appointment[];
  onAddAppointment: (appointment: Appointment) => void;
}

const CustomerBooking: React.FC<CustomerBookingProps> = ({
  doctors,
  appointments,
  onAddAppointment
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
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const doctorName = selectedDoctor?.name || '';
    
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      ...formData,
      doctorName,
      bookingStatus: 'upcoming',
      followUpStatus: 'none',
      createdAt: new Date(),
      updatedAt: new Date(),
      bookedBy: 'customer'
    };

    onAddAppointment(newAppointment);
    setIsSubmitted(true);
  };

  const resetForm = () => {
    setFormData({
      patientName: '',
      patientPhone: '',
      patientEmail: '',
      doctorId: '',
      date: '',
      time: '',
      reason: ''
    });
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-6">
            Your appointment has been successfully booked. You will receive a confirmation call shortly.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-2">Appointment Details:</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p><strong>Patient:</strong> {formData.patientName}</p>
              <p><strong>Doctor:</strong> {selectedDoctor?.name}</p>
              <p><strong>Date:</strong> {formData.date}</p>
              <p><strong>Time:</strong> {formData.time}</p>
              <p><strong>Phone:</strong> {formData.patientPhone}</p>
            </div>
          </div>
          <button
            onClick={resetForm}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Book Another Appointment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Your Appointment</h1>
            <p className="text-gray-600">Schedule your visit with our medical professionals</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <User className="w-4 h-4 inline mr-1" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your full name"
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
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={formData.patientEmail}
                  onChange={(e) => setFormData({ ...formData, patientEmail: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Doctor *
                </label>
                <select
                  required
                  value={formData.doctorId}
                  onChange={(e) => setFormData({ ...formData, doctorId: e.target.value, time: '' })}
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
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value, time: '' })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Preferred Time *
                  </label>
                  <select
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    disabled={!formData.doctorId || !formData.date}
                  >
                    <option value="">Select available time</option>
                    {availableTimeSlots.map(slot => (
                      <option key={slot.id} value={slot.startTime}>
                        {slot.startTime} - {slot.endTime}
                      </option>
                    ))}
                  </select>
                  {availableTimeSlots.length === 0 && formData.doctorId && formData.date && (
                    <p className="text-red-600 text-sm mt-1">No available slots for this date. Please choose another date.</p>
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
                  placeholder="Please describe the reason for your appointment"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Important Notes:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Please arrive 15 minutes early for your appointment</li>
                  <li>• Bring a valid ID and insurance card</li>
                  <li>• You will receive a confirmation call within 24 hours</li>
                  <li>• For cancellations, please call at least 24 hours in advance</li>
                </ul>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium text-lg"
              >
                Book Appointment
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerBooking;