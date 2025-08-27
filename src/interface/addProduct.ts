/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IProduct {
    product: {
        product_name: string;
        description: string;
    },
    price: {
        basic_price: number;
        discounted_rate: number;
        vat: number;
    };
    inventory: {
        quantity: number;
        sku_id: string;
        barcode: string;
    };
    shipping_details: {
        weight: number;
        width: number;
        height: number;
        length: number;
    };
    status: string;
}

export interface IAddProduct {
    product_name: string;
    description: string;
    price: {
        basic_price: number;
        discounted_rate: number;
        vat: number;
    };
    inventory: {
        quantity: number;
        sku_id: string;
        barcode: string;
    };
    status: string;
}

export interface ProductImage {
    images: File[];
}

export type Product = {
    id: number;
    product_id: string;
    admin_id: string;
    product_name: string;
    description: string;
    product_image: { image_id: string; image_url: string; }[] | null;
    price: {
        vat: number;
        basic_price: number;
        build_it_com: number;
        client_price: number;
        payment_price: number;
        discounted_rate: number;
    };
    inventory: {
        sku_id: string;
        barcode: string;
        quantity: number;
    };
    shipping_details: {
        width: number;
        height: number;
        length: number;
        weight: number;
    };
    status: string;
    created_at: string;
    updated_at: string;
};

export interface ProductImgae {
    image_id: string;
    image_url: string;
}

export type ImageWithTextConfig = {
    imageKey: string;
    textKey: string;
    imageConfig?: {
        width?: string;
        height?: string;
        className?: string;
        fallbackSrc?: string;
    };
};
export type DateRange = {
    from: Date | undefined;
    to: Date | undefined;
};

export type ButtonPropsT = {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
};

export type FilterOption = {
    label: string;
    value: string;
};

export type DataItemT = {
    [key: string]: any;
};

export type ColumnT<T> = {
    key: keyof T;
    header: string;
    sortable?: boolean;
    searchable?: boolean;
    isImageWithText?: boolean;
    imageWithTextConfig?: ImageWithTextConfig;
    render?: (value: any, item: T) => React.ReactNode;
};

export type TablePropsT<T extends DataItemT> = {
    data?: T[];
    columns: ColumnT<T>[];
    actions?: {
        onEdit?: (item: T) => void;
        onDelete?: (item: T) => void;
        onView?: (item: T) => void;
        onAssign?: (item: T) => void;
        onApprove?: (item: T) => void;
        onReject?: (item: T) => void;
        assignText?: string;
        showAssign?: (item: T) => boolean;
    };
    buttons?: ButtonPropsT[];
    className?: string;
    searchPlaceholder?: string;
    filterOptions?: FilterOption[];
    filterKey?: keyof T;
    dateFilterKey?: keyof T;
    itemsPerPage?: number;
    rowUrl?: (item: T) => string;
    isLoading?: boolean;
    emptyStateMessage?: string
    emptyStateSubMessage?: string
    onPageChange?: (page: number) => void;
    currentPage?: number;
    totalItems?: number;
};



export interface CartItems {
    product_id: string;
    quantity: number;
    sub_total: number;
}

export interface CustomerInfo {
    name: string;
    email: string;
    phone_number: string;
    address: string;
}