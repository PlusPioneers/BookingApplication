import React, { useState } from 'react';
import { Calendar, Users, UserPlus, Globe, ArrowLeft } from 'lucide-react';
import Navigation from './components/Navigation';
import AppointmentsOverview from './components/AppointmentsOverview';
import DoctorManagement from './components/DoctorManagement';
import ManualBooking from './components/ManualBooking';
import AllAppointments from './components/AllAppointments';
import MissedAppointments from './components/MissedAppointments';
import CustomerBooking from './components/CustomerBooking';
import { useRealtimeData } from './hooks/useRealtimeData';

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showCustomerPortal, setShowCustomerPortal] = useState(false);
  const [rescheduleData, setRescheduleData] = useState<Appointment | null>(null);
  
  const {
    doctors,
    appointments,
    lastUpdate,
    addDoctor,
    updateDoctor,
    deleteDoctor,
    addAppointment,
    updateAppointment,
    deleteAppointment
  } = useRealtimeData();

  const handleRescheduleAppointment = (appointment: Appointment) => {
    setRescheduleData(appointment);
    setActiveTab('manual-booking');
  };

  const handleCancelReschedule = () => {
    setRescheduleData(null);
  };

  const handleRescheduleSubmit = (updatedAppointment: Appointment) => {
    if (rescheduleData) {
      // Delete the old appointment and add the updated one
      deleteAppointment(rescheduleData.id);
      addAppointment(updatedAppointment);
    } else {
      addAppointment(updatedAppointment);
    }
  };

  if (showCustomerPortal) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
          <button
            onClick={() => setShowCustomerPortal(false)}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin Dashboard
          </button>
        </div>
        <CustomerBooking
          doctors={doctors}
          appointments={appointments}
          onAddAppointment={addAppointment}
        />
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <AppointmentsOverview
            appointments={appointments}
            onUpdateAppointment={updateAppointment}
          />
        );
      case 'doctors':
        return (
          <DoctorManagement
            doctors={doctors}
            onAddDoctor={addDoctor}
            onUpdateDoctor={updateDoctor}
            onDeleteDoctor={deleteDoctor}
          />
        );
      case 'manual-booking':
        return (
          <ManualBooking
            doctors={doctors}
            appointments={appointments}
            onAddAppointment={rescheduleData ? handleRescheduleSubmit : addAppointment}
            rescheduleData={rescheduleData}
            onCancelReschedule={handleCancelReschedule}
          />
        );
      case 'all-appointments':
        return (
          <AllAppointments
            appointments={appointments}
            onUpdateAppointment={updateAppointment}
            onDeleteAppointment={deleteAppointment}
          />
        );
      case 'missed-appointments':
        return (
          <MissedAppointments
            appointments={appointments}
            onUpdateAppointment={updateAppointment}
            onRescheduleAppointment={handleRescheduleAppointment}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Calendar className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Hospital Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Appointment Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCustomerPortal(true)}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Globe className="w-4 h-4 mr-2" />
                Customer Portal
              </button>
              {lastUpdate && (
                <div className="text-xs text-gray-500">
                  Last updated: {lastUpdate.toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              © 2025 Hospital Management System. All data stored locally.
            </p>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>Total Doctors: {doctors.length}</span>
              <span>Total Appointments: {appointments.length}</span>
              <span>Active Doctors: {doctors.filter(d => d.isActive).length}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;