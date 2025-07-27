import { Doctor, Appointment, TimeSlot } from '../types';

const STORAGE_KEYS = {
  DOCTORS: 'hospital_doctors',
  APPOINTMENTS: 'hospital_appointments',
  LAST_UPDATE: 'hospital_last_update'
} as const;

// Doctor Storage Functions
export const saveDoctors = (doctors: Doctor[]): void => {
  localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(doctors));
  updateLastModified();
};

export const loadDoctors = (): Doctor[] => {
  const data = localStorage.getItem(STORAGE_KEYS.DOCTORS);
  if (!data) return getDefaultDoctors();
  
  try {
    return JSON.parse(data);
  } catch {
    return getDefaultDoctors();
  }
};

// Appointment Storage Functions
export const saveAppointments = (appointments: Appointment[]): void => {
  localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
  updateLastModified();
};

export const loadAppointments = (): Appointment[] => {
  const data = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
  if (!data) return [];
  
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
};

// Utility Functions
export const updateLastModified = (): void => {
  localStorage.setItem(STORAGE_KEYS.LAST_UPDATE, new Date().toISOString());
};

export const getLastModified = (): Date | null => {
  const data = localStorage.getItem(STORAGE_KEYS.LAST_UPDATE);
  return data ? new Date(data) : null;
};

// Generate sample doctors with time slots
const getDefaultDoctors = (): Doctor[] => {
  const defaultSlots: TimeSlot[] = [
    { id: '1', startTime: '09:00', endTime: '09:30', dayOfWeek: 1, isAvailable: true },
    { id: '2', startTime: '09:30', endTime: '10:00', dayOfWeek: 1, isAvailable: true },
    { id: '3', startTime: '10:00', endTime: '10:30', dayOfWeek: 1, isAvailable: true },
    { id: '4', startTime: '10:30', endTime: '11:00', dayOfWeek: 1, isAvailable: true },
    { id: '5', startTime: '11:00', endTime: '11:30', dayOfWeek: 1, isAvailable: true },
    { id: '6', startTime: '14:00', endTime: '14:30', dayOfWeek: 1, isAvailable: true },
    { id: '7', startTime: '14:30', endTime: '15:00', dayOfWeek: 1, isAvailable: true },
    { id: '8', startTime: '15:00', endTime: '15:30', dayOfWeek: 1, isAvailable: true },
  ];

  return [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      specialization: 'Cardiology',
      phone: '+1-555-0101',
      email: 'sarah.johnson@hospital.com',
      isActive: true,
      availableSlots: defaultSlots,
      createdAt: new Date()
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      specialization: 'Neurology',
      phone: '+1-555-0102',
      email: 'michael.chen@hospital.com',
      isActive: true,
      availableSlots: defaultSlots,
      createdAt: new Date()
    },
    {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      specialization: 'Pediatrics',
      phone: '+1-555-0103',
      email: 'emily.rodriguez@hospital.com',
      isActive: true,
      availableSlots: defaultSlots,
      createdAt: new Date()
    }
  ];
};