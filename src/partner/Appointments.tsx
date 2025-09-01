import { useState, useEffect } from 'react';
import { Table } from '../components/Table';

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

    const columns = [
        {
            header: 'Time',
            key: 'time'
        },
        {
            header: 'Patient',
            key: 'patient',
            render: (appointment: Appointment) => (
                <div>
                    <div>{appointment.patientName}</div>
                    <div className="text-gray-500">{appointment.patientEmail}</div>
                </div>
            )
        },
        {
            header: 'Type',
            key: 'type'
        },
        {
            header: 'Status',
            key: 'status',
            render: (appointment: Appointment) => (
                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                </span>
            )
        },
        {
            header: 'Actions',
            key: 'actions',
            render: (appointment: Appointment) => (
                <div className="flex space-x-2">
                    {appointment.status === 'scheduled' && (
                        <>
                            <button
                                onClick={() => handleStatusChange(appointment.id, 'completed')}
                                className="text-green-600 hover:text-green-900"
                            >
                                Complete
                            </button>
                            <button
                                onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                                className="text-red-600 hover:text-red-900"
                            >
                                Cancel
                            </button>
                        </>
                    )}
                </div>
            )
        }
    ];

    return (
        <div className="px-4 sm:px-4 lg:px-8">
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
            <Table
                data={appointments}
                columns={columns}
                loading={loading}
                emptyMessage="No appointments found for this date"
            />
        </div>
    );
};

export default PartnerAppointments;
