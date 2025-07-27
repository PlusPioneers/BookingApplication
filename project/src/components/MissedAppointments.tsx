import React, { useMemo } from 'react';
import { AlertTriangle, Calendar, Phone, User, Clock } from 'lucide-react';
import { Appointment } from '../types';

interface MissedAppointmentsProps {
  appointments: Appointment[];
  onUpdateAppointment: (id: string, updates: Partial<Appointment>) => void;
  onRescheduleAppointment: (appointment: Appointment) => void;
}

const MissedAppointments: React.FC<MissedAppointmentsProps> = ({
  appointments,
  onUpdateAppointment,
  onRescheduleAppointment
}) => {
  const missedAppointments = useMemo(() => {
    return appointments
      .filter(apt => apt.bookingStatus === 'missed')
      .sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));
  }, [appointments]);

  const handleFollowUpChange = (appointmentId: string, newStatus: Appointment['followUpStatus']) => {
    onUpdateAppointment(appointmentId, { followUpStatus: newStatus });
  };

  const markAsCompleted = (appointmentId: string) => {
    onUpdateAppointment(appointmentId, { bookingStatus: 'completed' });
  };

  const rescheduleAppointment = (appointmentId: string) => {
    const appointment = appointments.find(apt => apt.id === appointmentId);
    if (appointment) {
      onRescheduleAppointment(appointment);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="w-6 h-6 text-orange-600" />
          <h2 className="text-2xl font-bold text-gray-900">Missed Appointments</h2>
        </div>
        <div className="text-sm text-gray-600">
          {missedAppointments.length} missed appointments
        </div>
      </div>

      {missedAppointments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No missed appointments</h3>
          <p className="text-gray-500">All appointments are being handled properly.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-red-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Missed Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Follow-up Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {missedAppointments.map((appointment) => (
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
                        <Calendar className="w-4 h-4 text-orange-500 mr-1" />
                        <div>
                          <div className="font-medium">{appointment.date}</div>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => rescheduleAppointment(appointment.id)}
                          className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded hover:bg-blue-50 text-xs"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => markAsCompleted(appointment.id)}
                          className="text-green-600 hover:text-green-900 px-2 py-1 rounded hover:bg-green-50 text-xs"
                        >
                          Mark Completed
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {missedAppointments.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-orange-800">Follow-up Required</h3>
              <p className="text-sm text-orange-700 mt-1">
                These patients missed their appointments and may need follow-up calls or rescheduling. 
                Consider reaching out to ensure they receive the care they need.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MissedAppointments;