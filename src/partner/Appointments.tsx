import { useState } from 'react';
import { getAppointments } from './services/api-service';
import { useQuery } from 'react-query';
import Table from '../utils/Table';
import type { ColumnT } from '../interface/addProduct';

interface Price {
    client_amount: string;
    build_it_amount: string;
}

interface Appointment {
    session_id: string;
    full_name: string;
    email: string;
    phone_number: string;
    address: string;
    service_needed: string;
    where_it_hurts: string;
    session_status: string;
    limitaions: string;
    pain_durations: string;
    amount: string;
    price: Price;
    appointment_time: string;
    appointment_date: string;
    created_at: string;
    updated_at: string;
}

const PartnerAppointments = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>(
        new Date().toISOString().split('T')[0]
    );
    const [page, setPage] = useState(1)
    const limit = 10
    const { isLoading: loading } = useQuery(['appointments', selectedDate], () => getAppointments(page.toString(), limit.toString()), {
        onSuccess: (data) => {
            setAppointments(data.data.appointments)
        }
    });

    const Columns: ColumnT<Appointment>[] = [
        {
            key: "full_name",
            header: "Full Name",
        },
        {
            key: "email",
            header: "Email",
        },
        {
            key: "phone_number",
            header: "Phone Number",
        },
        {
            key: "service_needed",
            header: "Service Needed",
            sortable: false,
        },
        {
            key: "session_status",
            header: "Status",
            render: (session) => {
                const statusText = session || "N/A";
                let className = "";
                if (statusText.toLowerCase() === "pending") {
                    className = "bg-yellow-100 text-yellow-800";
                } else if (statusText.toLowerCase() === "completed") {
                    className = "bg-green-100 text-green-800";
                } else if (statusText.toLowerCase() === "cancelled") {
                    className = "bg-red-100 text-red-800";
                } else {
                    className = "bg-gray-100 text-gray-800";
                }
                return (
                    <span className={`px-2 py-1 rounded-full text-xs uppercase ${className}`}>
                        {statusText}
                    </span>
                );
            },
        },
    ]

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

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
            <div className='pt-4'>
                <Table
                    data={appointments}
                    columns={Columns}
                    isLoading={loading}
                    itemsPerPage={limit}
                    currentPage={page}
                    onPageChange={handlePageChange}
                    searchPlaceholder="Search appointments..."
                    emptyStateMessage="No appointments found"
                    actions={{
                        onView: (item) => {
                            console.log('View appointment:', item);
                        }
                    }}
                    filterOptions={[
                        { label: 'All', value: 'all' },
                        { label: 'Pending', value: 'pending' },
                        { label: 'Completed', value: 'completed' },
                        { label: 'Cancelled', value: 'cancelled' }
                    ]}
                />
            </div>
        </div>
    );
};

export default PartnerAppointments;
