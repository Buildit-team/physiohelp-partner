import { useState, useEffect } from 'react';
import { Table } from '../components/Table';

interface Patient {
    id: string;
    name: string;
    email: string;
    phone: string;
    lastVisit: string;
    nextAppointment: string | null;
    status: 'active' | 'inactive';
}

const PartnerPatients = () => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                // Replace with your actual API call
                const response = await fetch('/api/partner/patients', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('partner_token')}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setPatients(data);
                }
            } catch (error) {
                console.error('Error fetching patients:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, []);

    const filteredPatients = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm)
    );

    const columns = [
        {
            header: 'Name',
            key: 'name',
        },
        {
            header: 'Contact',
            key: 'contact',
            render: (patient: Patient) => (
                <div>
                    <div>{patient.email}</div>
                    <div>{patient.phone}</div>
                </div>
            ),
        },
        {
            header: 'Last Visit',
            key: 'lastVisit',
        },
        {
            header: 'Next Appointment',
            key: 'nextAppointment',
        },
        {
            header: 'Status',
            key: 'status',
            render: (patient: Patient) => (
                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${patient.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                    {patient.status}
                </span>
            ),
        },
    ];

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold text-gray-900">Patients</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of all patients registered at your hospital
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <input
                        type="text"
                        placeholder="Search patients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                </div>
            </div>
            <Table
                data={filteredPatients}
                columns={columns}
                loading={loading}
                emptyMessage="No patients found"
            />
        </div>
    );
};

export default PartnerPatients;
