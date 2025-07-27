import { useState, useEffect, useCallback } from 'react';
import { Doctor, Appointment } from '../types';
import { 
  loadDoctors, 
  saveDoctors, 
  loadAppointments, 
  saveAppointments,
  getLastModified 
} from '../utils/localStorage';

export const useRealtimeData = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Load initial data
  useEffect(() => {
    setDoctors(loadDoctors());
    setAppointments(loadAppointments());
    setLastUpdate(getLastModified());
  }, []);

  // Listen for storage changes (for real-time updates)
  useEffect(() => {
    const handleStorageChange = () => {
      setDoctors(loadDoctors());
      setAppointments(loadAppointments());
      setLastUpdate(getLastModified());
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check for changes periodically
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Doctor operations
  const addDoctor = useCallback((doctor: Doctor) => {
    const newDoctors = [...doctors, doctor];
    setDoctors(newDoctors);
    saveDoctors(newDoctors);
  }, [doctors]);

  const updateDoctor = useCallback((doctorId: string, updates: Partial<Doctor>) => {
    const newDoctors = doctors.map(doc => 
      doc.id === doctorId ? { ...doc, ...updates } : doc
    );
    setDoctors(newDoctors);
    saveDoctors(newDoctors);
  }, [doctors]);

  const deleteDoctor = useCallback((doctorId: string) => {
    const newDoctors = doctors.filter(doc => doc.id !== doctorId);
    setDoctors(newDoctors);
    saveDoctors(newDoctors);
  }, [doctors]);

  // Appointment operations
  const addAppointment = useCallback((appointment: Appointment) => {
    const newAppointments = [...appointments, appointment];
    setAppointments(newAppointments);
    saveAppointments(newAppointments);
  }, [appointments]);

  const updateAppointment = useCallback((appointmentId: string, updates: Partial<Appointment>) => {
    const newAppointments = appointments.map(apt => 
      apt.id === appointmentId ? { ...apt, ...updates, updatedAt: new Date() } : apt
    );
    setAppointments(newAppointments);
    saveAppointments(newAppointments);
  }, [appointments]);

  const deleteAppointment = useCallback((appointmentId: string) => {
    const newAppointments = appointments.filter(apt => apt.id !== appointmentId);
    setAppointments(newAppointments);
    saveAppointments(newAppointments);
  }, [appointments]);

  return {
    doctors,
    appointments,
    lastUpdate,
    addDoctor,
    updateDoctor,
    deleteDoctor,
    addAppointment,
    updateAppointment,
    deleteAppointment
  };
};