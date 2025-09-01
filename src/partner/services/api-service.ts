import axios from 'axios';
import type { AppointmentFormData } from '../../interface/session';
const VITE_ENDPOINT = import.meta.env.VITE_API_URL;
export const getAllSessionType = async () => {
    const response = await axios.get(`${VITE_ENDPOINT}/session-types`);
    return response.data;
}

export const bookAppointment = async (appointmentData: AppointmentFormData) => {
    const response = await axios.post(`${VITE_ENDPOINT}/appointments`, appointmentData);
    return response.data;
}
export const getAppointments = async (partnerId: string) => {
    const response = await axios.get(`${VITE_ENDPOINT}/partners/${partnerId}/appointments`);
    return response.data;
}
export const getPatients = async (partnerId: string) => {
    const response = await axios.get(`${VITE_ENDPOINT}/partners/${partnerId}/patients`);
    return response.data;
}
export const getPatientDetails = async (patientId: string) => {
    const response = await axios.get(`${VITE_ENDPOINT}/patients/${patientId}`);
    return response.data;
}
export const loginPartner = async (email: string, password: string) => {
    const response = await axios.post(`${VITE_ENDPOINT}/partner/login`, { email, password });
    return response.data;
}
export const getPartnerDetails = async (partnerId: string) => {
    const response = await axios.get(`${VITE_ENDPOINT}/partners/${partnerId}`);
    return response.data;
}
export const resetPassword = async (token: string, password: string) => {
    const response = await axios.post(`${VITE_ENDPOINT}/partner/reset-password`, { token, password });
    return response.data;
}
