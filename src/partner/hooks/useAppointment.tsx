/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from 'react';
import { useQuery } from 'react-query';
import { getAppointments } from '../services/api-service';

import type { Appointment } from '../../interface/appointment';

interface AppointmentContextType {
    appointments: Appointment[];
    selectedDate: string;
    setSelectedDate: (date: string) => void;
    page: number;
    setPage: (page: number) => void;
    limit: number;
    loading: boolean;
    totalAppointments: number;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export function AppointmentProvider({ children }: { children: ReactNode }) {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>(
        new Date().toISOString().split('T')[0]
    );
    const [page, setPage] = useState(1);
    const limit = 10;

    const { isLoading: loading } = useQuery(
        ['appointments', selectedDate, page],
        () => getAppointments(page.toString(), limit.toString()),
        {
            onSuccess: (data) => {
                setAppointments(data.data.appointments);
            }
        }
    );

    const value = {
        appointments,
        selectedDate,
        setSelectedDate,
        page,
        setPage,
        limit,
        loading,
        totalAppointments: appointments.length
    };

    return (
        <AppointmentContext.Provider value={value}>
            {children}
        </AppointmentContext.Provider>
    );
}

export function useAppointment() {
    const context = useContext(AppointmentContext);
    if (context === undefined) {
        throw new Error('useAppointment must be used within an AppointmentProvider');
    }
    return context;
}
