import { createBrowserRouter } from "react-router-dom";
import PartnerLogin from "./partner/PartnerLogin";

export const router =createBrowserRouter ([
    {
        path: '/',
        element: <PartnerLogin />
    }
])