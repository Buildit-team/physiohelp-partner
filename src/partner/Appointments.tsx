import { useState, useEffect } from 'react';

interface Appointment {
    id: string;
    patientName: string;
    patientEmail: string;
    date: string;
    time: string;
    type: string;
    status: 'scheduled' | 'completed' | 'cancelled';
    notes?: string;
}

const PartnerAppointments = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<string>(
        new Date().toISOString().split('T')[0]
    );

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                // Replace with your actual API call
                const response = await fetch(`/api/partner/appointments?date=${selectedDate}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('partner_token')}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setAppointments(data);
                }
            } catch (error) {
                console.error('Error fetching appointments:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [selectedDate]);

    const handleStatusChange = async (appointmentId: string, newStatus: Appointment['status']) => {
        try {
            // Replace with your actual API call
            const response = await fetch(`/api/partner/appointments/${appointmentId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('partner_token')}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                setAppointments(prev =>
                    prev.map(apt =>
                        apt.id === appointmentId ? { ...apt, status: newStatus } : apt
                    )
                );
            }
        } catch (error) {
            console.error('Error updating appointment:', error);
        }
    };

    const getStatusColor = (status: Appointment['status']) => {
        switch (status) {
            case 'scheduled':
                return 'bg-yellow-100 text-yellow-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold text-gray-900">Appointments</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Manage appointments for your hospital
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                </div>
            </div>
            <div className="mt-8 flex flex-col">
                <div className="-mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Time
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Patient
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Type
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Status
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={5} className="px-3 py-4 text-sm text-gray-500 text-center">
                                                Loading appointments...
                                            </td>
                                        </tr>
                                    ) : appointments.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-3 py-4 text-sm text-gray-500 text-center">
                                                No appointments for this date
                                            </td>
                                        </tr>
                                    ) : (
                                        appointments.map((appointment) => (
                                            <tr key={appointment.id}>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                                                    {appointment.time}
                                                </td>
                                                <td className="px-3 py-4 text-sm text-gray-900">
                                                    <div>{appointment.patientName}</div>
                                                    <div className="text-gray-500">{appointment.patientEmail}</div>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                                                    {appointment.type}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(appointment.status)}`}>
                                                        {appointment.status}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                                                    <select
                                                        value={appointment.status}
                                                        onChange={(e) => handleStatusChange(appointment.id, e.target.value as Appointment['status'])}
                                                        className="rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
                                                    >
                                                        <option value="scheduled">Scheduled</option>
                                                        <option value="completed">Completed</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PartnerAppointments;
