import { useState } from 'react';
import toast from 'react-hot-toast';

const PartnerSettings = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        working_hours: {
            monday: { start: '09:00', end: '17:00' },
            tuesday: { start: '09:00', end: '17:00' },
            wednesday: { start: '09:00', end: '17:00' },
            thursday: { start: '09:00', end: '17:00' },
            friday: { start: '09:00', end: '17:00' },
            saturday: { start: '09:00', end: '14:00' },
            sunday: { start: '00:00', end: '00:00' }
        },
        password: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleWorkingHoursChange = (day: string, type: 'start' | 'end', value: string) => {
        setFormData(prev => ({
            ...prev,
            working_hours: {
                ...prev.working_hours,
                [day]: {
                    ...prev.working_hours[day as keyof typeof prev.working_hours],
                    [type]: value
                }
            }
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (formData.newPassword !== formData.confirmPassword) {
                throw new Error('New passwords do not match');
            }
            // If password fields are filled, update password
            if (formData.password && formData.newPassword) {
                // Replace with your actual API call
                const response = await fetch('/api/partner/update-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('partner_token')}`
                    },
                    body: JSON.stringify({
                        currentPassword: formData.password,
                        newPassword: formData.newPassword
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to update password');
                }
            }

            toast.success('Settings updated successfully');
            setFormData(prev => ({ ...prev, password: '', newPassword: '', confirmPassword: '' }));
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to update settings');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage your account and hospital settings
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200">
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium leading-6 text-gray-900">Profile</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Update your personal information
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                />
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 space-y-6">
                        <div>
                            <h3 className="text-lg font-medium leading-6 text-gray-900">Working Hours</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Set your hospital's operating hours
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {Object.entries(formData.working_hours).map(([day, hours]) => (
                                <div key={day} className="border rounded-lg p-4">
                                    <h4 className="text-sm font-medium text-gray-700 capitalize mb-2">{day}</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-xs text-gray-500">Open</label>
                                            <input
                                                type="time"
                                                value={hours.start}
                                                onChange={(e) => handleWorkingHoursChange(day, 'start', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500">Close</label>
                                            <input
                                                type="time"
                                                value={hours.end}
                                                onChange={(e) => handleWorkingHoursChange(day, 'end', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-8 space-y-6">
                        <div>
                            <h3 className="text-lg font-medium leading-6 text-gray-900">Change Password</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Update your password
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                            <div className="sm:col-span-6">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                />
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    id="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                />
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-5">
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`ml-3 inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${loading ? 'opacity-75 cursor-not-allowed' : ''
                                    }`}
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PartnerSettings;
