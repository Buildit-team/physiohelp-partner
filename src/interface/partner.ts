export interface IPartner {
    partner_id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    subdomain: string;
    logo?: string;
    description?: string;
    created_at: string;
    updated_at: string;
    status: 'active' | 'inactive';
    working_hours?: {
        monday: { start: string; end: string };
        tuesday: { start: string; end: string };
        wednesday: { start: string; end: string };
        thursday: { start: string; end: string };
        friday: { start: string; end: string };
        saturday: { start: string; end: string };
        sunday: { start: string; end: string };
    };
}
