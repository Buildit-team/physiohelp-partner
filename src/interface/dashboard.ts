export interface Order {
    id: number;
    product: string;
    price: number;
    status: 'Pending' | 'Completed';
    date: string;
    image: 'chair-black' | 'chair-controller' | 'chair-round';
}

export interface StatisticItem {
    title: string;
    value: number | string;
    change?: string;
    changeDirection?: 'up' | 'down' | 'neutral';
}

export interface SalesDataPoint {
    day: string;
    value: number;
}