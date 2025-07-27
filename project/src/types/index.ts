export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  phone: string;
  email: string;
  isActive: boolean;
  availableSlots: TimeSlot[];
  createdAt: Date;
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  isAvailable: boolean;
}

export interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  reason: string;
  bookingStatus: 'upcoming' | 'completed' | 'cancelled' | 'missed';
  followUpStatus: 'none' | 'required' | 'scheduled' | 'completed';
  followUpDate?: string;
  createdAt: Date;
  updatedAt: Date;
  bookedBy: 'customer' | 'staff';
}

export interface BookingFormData {
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  doctorId: string;
  date: string;
  time: string;
  reason: string;
}