import Table from '../utils/Table';
import type { ColumnT } from '../interface/addProduct';
import { useAppointment } from './hooks/useAppointment';
import type { Appointment } from '../interface/appointment';

const PartnerAppointments = () => {
    const {
        appointments,
        selectedDate,
        setSelectedDate,
        page,
        setPage,
        limit,
        loading,
        // totalAppointments 
    } = useAppointment();

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
        <div className="pt-4">
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
