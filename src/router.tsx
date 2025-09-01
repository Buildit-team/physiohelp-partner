import { createBrowserRouter } from "react-router-dom";
import PartnerLogin from "./partner/PartnerLogin";
import ResetPassword from "./partner/ResetPassword";
import Dashboard from "./partner/Dashboard";
import Appointments from "./partner/Appointments";
import CreateAppointment from "./partner/CreateAppointment";
import PartnerPatients from "./partner/Patients";
import PartnerLayout from "./partner/Layout";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <PartnerLogin />
    },
    {
        path: 'reset-password',
        element: <ResetPassword />
    },
    {
        path: 'partners',
        element: <PartnerLayout />,
        children: [
            {
                path: '',
                index: true,
                element: <Dashboard />
            },
            {
                path: 'appointments',
                element: <Appointments />
            },
            {
                path: 'create-appointment',
                element: <CreateAppointment />
            },
            {
                path: 'patients',
                element: <PartnerPatients />
            }
        ]
    }
])
