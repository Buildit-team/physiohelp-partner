import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';
import { Calendar, Clock, MapPin, Phone, Mail, User, Activity, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatCurrency } from '../utils/formatNumbers';
import { bookAppointment, getAllSessionType } from './services/api-service';
import type { AppointmentFormData, SessionType, AppointmentData } from '../interface/session';


const PartnerCreateAppointment = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<AppointmentFormData>({
        full_name: '',
        email: '',
        phone_number: '',
        address: '',
        service_needed: '',
        where_it_hurts: '',
        pain_durations: '',
        limitaions: '',
        appointment_date: '',
        appointment_time: '',
    });

    const [allService, setAllService] = useState<SessionType[]>([]);

    useQuery(['ALLSESSION'], getAllSessionType, {
        onSuccess: (data) => {
            setAllService(data);
        }
    });

    const appointmentMutation = useMutation(bookAppointment, {
        onSuccess: (data) => {
            toast.success('Appointment created successfully! Confirmation email sent to the client.');
            console.log('Appointment created:', data);
            navigate('/partners/appointments');
        },
        onError: (error: unknown) => {
            const errorMessage = error && typeof error === 'object' && 'response' in error
                ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
                : 'Failed to create appointment';
            toast.error(errorMessage || 'Failed to create appointment');
            console.error('Appointment creation failed:', error);
        }
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleServiceChange = (serviceType: string) => {
        setFormData(prev => ({
            ...prev,
            service_needed: serviceType
        }));
    };

    const validateForm = () => {
        const requiredFields = [
            'full_name', 'email', 'phone_number', 'address',
            'service_needed', 'appointment_date', 'appointment_time'
        ];

        for (const field of requiredFields) {
            if (!formData[field as keyof AppointmentFormData]) {
                toast.error(`Please fill in ${field.replace('_', ' ')}`);
                return false;
            }
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error('Please enter a valid email address');
            return false;
        }

        const phoneRegex = /^\+?[\d\s-]{10,}$/;
        if (!phoneRegex.test(formData.phone_number)) {
            toast.error('Please enter a valid phone number');
            return false;
        }

        return true;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const selectedService = allService.find(service => service.session_type === formData.service_needed);

        if (!selectedService) {
            toast.error('Please select a valid service');
            return;
        }

        const appointmentData: AppointmentData = {
            ...formData,
            amount: parseFloat(selectedService.amount),
            price: {
                client_amount: parseFloat(selectedService.amount)
            }
        };

        appointmentMutation.mutate(appointmentData);
    };

    return (
        <div className="w-full max-[650px]:p-2">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-blue-600 px-6 py-4 text-white">
                        <h1 className="text-2xl font-semibold flex items-center">
                            <Activity className="mr-2 h-6 w-6" />
                            Create Appointment for Your Client
                        </h1>
                        <p className="mt-1 text-blue-100">
                            Create an appointment for clients who cannot book online. They will receive a confirmation email.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                                Client Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <User className="inline h-4 w-4 mr-1" />
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="full_name"
                                        value={formData.full_name}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter client's full name"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <Mail className="inline h-4 w-4 mr-1" />
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter client's email"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <Phone className="inline h-4 w-4 mr-1" />
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone_number"
                                        value={formData.phone_number}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter client's phone number"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <MapPin className="inline h-4 w-4 mr-1" />
                                        Address *
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter client's address"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Service Information Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                                Service Information
                            </h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Service Needed *
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {allService.map((service) => (
                                        <label key={service.type_id} className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="service_needed"
                                                value={service.session_type}
                                                checked={formData.service_needed === service.session_type}
                                                onChange={() => handleServiceChange(service.session_type)}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                required
                                            />
                                            <span className="ml-2 text-sm text-gray-700">
                                                {service.session_type} - {formatCurrency(service.amount)}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Where does it hurt?
                                    </label>
                                    <textarea
                                        name="where_it_hurts"
                                        value={formData.where_it_hurts}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Describe the pain location"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Pain Duration
                                    </label>
                                    <input
                                        type="text"
                                        name="pain_durations"
                                        value={formData.pain_durations}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="How long have you had this pain?"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Limitations
                                </label>
                                <textarea
                                    name="limitaions"
                                    value={formData.limitaions}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Describe any physical limitations"
                                />
                            </div>
                        </div>

                        {/* Appointment Scheduling Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                                Appointment Scheduling
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <Calendar className="inline h-4 w-4 mr-1" />
                                        Appointment Date *
                                    </label>
                                    <input
                                        type="date"
                                        name="appointment_date"
                                        value={formData.appointment_date}
                                        onChange={handleInputChange}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <Clock className="inline h-4 w-4 mr-1" />
                                        Appointment Time *
                                    </label>
                                    <input
                                        type="time"
                                        name="appointment_time"
                                        value={formData.appointment_time}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Information Box */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex">
                                <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                                <div className="text-sm">
                                    <h4 className="font-medium text-blue-800 mb-1">Important Information</h4>
                                    <ul className="text-blue-700 space-y-1">
                                        <li>• The client will receive a confirmation email with appointment details</li>
                                        <li>• They can click the link in the email to view and pay for their appointment</li>
                                        <li>• The payment process is the same as online bookings</li>
                                        <li>• You can track the appointment status in the Appointments section</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                            <button
                                type="button"
                                onClick={() => navigate('/partners/appointments')}
                                className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={appointmentMutation.isLoading}
                                className={`px-6 py-3 border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${appointmentMutation.isLoading ? 'opacity-75 cursor-not-allowed' : ''
                                    }`}
                            >
                                {appointmentMutation.isLoading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating Appointment...
                                    </span>
                                ) : (
                                    'Create Appointment'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PartnerCreateAppointment;
