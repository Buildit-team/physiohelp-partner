import axios from 'axios';
import type { AppointmentFormData } from '../../interface/session';

export const getAllSessionType = async () => {
    const response = await axios.get('/session-types');
    return response.data;
}

export const bookAppointment = async (appointmentData: AppointmentFormData) => {
    const response = await axios.post('/appointments', appointmentData);
    return response.data;
}