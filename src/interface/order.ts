export interface ProductImage {
    image_id: string;
    image_url: string;
}

export interface ProductPrice {
    vat: number;
    basic_price: number;
    build_it_com: number;
    client_price: number;
    payment_price: number;
    discounted_rate: number;
}

export interface ProductInventory {
    sku_id: string;
    barcode: string;
    quantity: number;
}

export interface ShippingDetails {
    width: number;
    height: number;
    length: number;
    weight: number;
}

export interface Product {
    id: number;
    product_id: string;
    admin_id: string;
    product_name: string;
    description: string;
    product_image: ProductImage[];
    price: ProductPrice;
    inventory: ProductInventory;
    shipping_details: ShippingDetails;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface CartItem {
    quantity: number;
    sub_total: number;
    product_id: string;
    product: Product;
}

export interface Customer {
    customer_id: string;
    name: string;
    email: string;
    address: string;
    phone_number: string;
    created_at: string;
    updated_at: string;
}

export interface Order {
    order_id: string;
    customer_id: string;
    order_status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'abandoned';
    order_track_id: string;
    cart_id: string;
    order_note: string | null;
    total_price: string;
    created_at: string;
    updated_at: string;
}

export interface OrderDetailsResponse {
    status: boolean;
    message: string;
    data: {
        order: Order;
        customer: Customer;
        cartItems: CartItem[];
    };
}