import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { Menu } from 'lucide-react';
import PartnerSidebar from './components/Sidebar';
import { AppointmentProvider } from './hooks/useAppointment';

const PartnerLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <div className="hidden md:flex md:w-[20%] md:flex-col sticky top-0 h-screen">
                <div className="flex flex-col flex-grow">
                    <PartnerSidebar onClose={() => setSidebarOpen(false)} />
                </div>
            </div>

            {sidebarOpen && (
                <div className="fixed inset-0 z-40 md:hidden">
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
                    <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
                        <PartnerSidebar onClose={() => setSidebarOpen(false)} />
                    </div>
                </div>
            )}

            <div className="flex-1 flex flex-col">
                <nav className="bg-white border-b border-gray-200 md:hidden">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                <button
                                    onClick={() => setSidebarOpen(true)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <Menu size={24} />
                                </button>
                                <img src="/newlogo.svg" alt="Logo" className="ml-4 h-8" />
                            </div>
                        </div>
                    </div>
                </nav>

                <main className="flex-1 py-6">
                    <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
                        <AppointmentProvider>
                            <Outlet />
                        </AppointmentProvider>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PartnerLayout;
