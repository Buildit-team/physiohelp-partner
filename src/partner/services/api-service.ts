import axios from 'axios';
import type { AppointmentFormData } from '../../interface/session';
const VITE_ENDPOINT = import.meta.env.VITE_ENDPOINT;


export const getAllSessionType = async () => {
    const response = await axios.get(`${VITE_ENDPOINT}/session-types`);
    return response.data;
}

export const bookAppointment = async (appointmentData: AppointmentFormData) => {
    const response = await axios.post(`${VITE_ENDPOINT}/appointments`, appointmentData);
    return response.data;
}
export const getAppointments = async (page: string, limit: string) => {
    const token = localStorage.getItem('partner_token')
    const response = await axios.get(`${VITE_ENDPOINT}/partners/appointments`, {
        headers: {
            Authorization:  `Bearer ${token}`
        },
        params: {
            page,
            limit
        }
    });
    return response.data;
}
export const getPatients = async (partnerId: string) => {
    const response = await axios.get(`${VITE_ENDPOINT}/partners/${partnerId}/patients`);
    return response.data;
}
export const getPatientDetails = async (patientId: string) => {
    const token = localStorage.getItem('partner_token')
    const response = await axios.get(`${VITE_ENDPOINT}/patients/${patientId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}
export const loginPartner = async (email: string, password: string) => {
    const response = await axios.post(`${VITE_ENDPOINT}/partners/login`, { email, password });
    return response.data;
}
export const getPartnerDetails = async () => {
    const token = localStorage.getItem('partner_token')
    const response = await axios.get(`${VITE_ENDPOINT}/partners`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}

export const resetPassword = async (email: string, password: string) => {
    const response = await axios.post(`${VITE_ENDPOINT}/partners/setup-password`, { email, password });
    return response.data;
}
