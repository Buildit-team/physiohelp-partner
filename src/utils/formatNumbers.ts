/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Formats a number to have commas and optional decimal places.
 * @param value - The number to format.
 * @param decimals - Number of decimal places (optional).
 * @returns A string with formatted number (e.g., "1,000", "25,430.50").
 */
export function formatNumber(value: number, decimals: number = 0): string {
    if (isNaN(value)) return '0';

    return value.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
}

export const formatCurrency = (amount: number | string) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'NGN',
    }).format(Number(amount));
};

export const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export const formatTime = (timeString: { split: (arg0: string) => [any, any]; }) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));

    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
};
