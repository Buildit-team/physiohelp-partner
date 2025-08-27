// Basic interfaces for nested objects
interface OrderItem {
    name: string;
    quantity: number;
    price: number;
}

export interface Transaction {
    id: string;
    date: string;
    amount: number;
    status: 'completed' | 'pending' | 'failed';
    items: OrderItem[];
}

export interface Customer {
    customer_id: string;
    name: string;
    email: string;
    address: string;
    phone_number: string;
    created_at: string;
    updated_at: string;
    total_orders: number;
    total_spent: number;
}

export interface CustomerAnalytics {
    customer: {
        customer_id: string;
        name: string;
        email: string;
        address: string;
        phone_number: string;
        created_at: string;
        updated_at: string;
        total_orders: number;
        total_spent: number;
    };
    total_orders: number;
    total_spent: number;
}

export interface CustomerAnalyticsResponse {
    status: boolean;
    message: string;
    data: CustomerAnalytics[];
}

export interface CustomerOrderStats {
    total_orders: number;
    completed_orders: number;
    pending_orders: number;
    abandoned_orders: number;
    total_amount_spent: number;
}

export interface CustomerOrderTransactionHistory {
    payment_id: string;
    customer_id: string;
    event_payment_id: string;
    order_status: boolean;
    payment_track_id: string;
    payment_status: string; 
    payment_type:  string; 
    processor: string;
    total_price: string;
    fee: string;
    created_at: string; 
    updated_at: string;
}