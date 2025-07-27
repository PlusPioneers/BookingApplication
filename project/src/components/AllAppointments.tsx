import React, { useMemo, useState } from 'react';
import { Search, Filter, Calendar, Phone, User, Clock } from 'lucide-react';
import { Appointment } from '../types';
import StatusBadge from './StatusBadge';

interface AllAppointmentsProps {
  appointments: Appointment[];
  onUpdateAppointment: (id: string, updates: Partial<Appointment>) => void;
  onDeleteAppointment: (id: string) => void;
}

const AllAppointments: React.FC<AllAppointmentsProps> = ({
  appointments,
  onUpdateAppointment,
  onDeleteAppointment
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const filteredAndSortedAppointments = useMemo(() => {
    let filtered = appointments.filter(apt => {
      const matchesSearch = searchTerm === '' || 
        apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.patientPhone.includes(searchTerm);
      
      const matchesStatus = statusFilter === 'all' || apt.bookingStatus === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    // Sort appointments
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`);
        case 'patient':
          return a.patientName.localeCompare(b.patientName);
        case 'doctor':
          return a.doctorName.localeCompare(b.doctorName);
        case 'status':
          return a.bookingStatus.localeCompare(b.bookingStatus);
        default:
          return 0;
      }
    });

    return filtered;
  }, [appointments, searchTerm, statusFilter, sortBy]);

  const handleStatusChange = (appointmentId: string, newStatus: Appointment['bookingStatus']) => {
    onUpdateAppointment(appointmentId, { bookingStatus: newStatus });
  };

  const handleFollowUpChange = (appointmentId: string, newStatus: Appointment['followUpStatus']) => {
    onUpdateAppointment(appointmentId, { followUpStatus: newStatus });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">All Appointments</h2>
        <div className="text-sm text-gray-600">
          {filteredAndSortedAppointments.length} of {appointments.length} appointments
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by patient name, doctor, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="missed">Missed</option>
            </select>
          </div>
          
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="date">Sort by Date (Newest)</option>
              <option value="patient">Sort by Patient Name</option>
              <option value="doctor">Sort by Doctor</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Follow-up
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booked By
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedAppointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.patientName}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {appointment.patientPhone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {appointment.doctorName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                      <div>
                        <div>{appointment.date}</div>
                        <div className="text-gray-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {appointment.time}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                    <div className="truncate" title={appointment.reason}>
                      {appointment.reason}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={appointment.bookingStatus}
                      onChange={(e) => handleStatusChange(appointment.id, e.target.value as Appointment['bookingStatus'])}
                      className="text-xs border border-gray-300 rounded-md px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="completed">Completed</option>
                      <option value="missed">Missed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={appointment.followUpStatus}
                      onChange={(e) => handleFollowUpChange(appointment.id, e.target.value as Appointment['followUpStatus'])}
                      className="text-xs border border-gray-300 rounded-md px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="none">None</option>
                      <option value="required">Required</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      appointment.bookedBy === 'customer' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {appointment.bookedBy === 'customer' ? 'Online' : 'Staff'}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredAndSortedAppointments.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No appointments found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllAppointments;