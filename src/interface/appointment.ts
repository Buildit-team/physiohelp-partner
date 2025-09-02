export interface Price {
    client_amount: string;
    build_it_amount: string;
}

export interface Appointment {
    session_id: string;
    full_name: string;
    email: string;
    phone_number: string;
    address: string;
    service_needed: string;
    where_it_hurts: string;
    session_status: string;
    limitaions: string;
    pain_durations: string;
    amount: string;
    price: Price;
    appointment_time: string;
    appointment_date: string;
    created_at: string;
    updated_at: string;
}
