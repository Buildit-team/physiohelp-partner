export interface PartnerUser {
    id: string;
    name: string;
    email: string;
    role: 'owner' | 'staff' | 'admin';
    hospital_id: string;
    hospital_name: string;
}

export interface AuthState {
    isAuthenticated: boolean;
    user: PartnerUser | null;
    loading: boolean;
}

export interface AuthContextType extends AuthState {
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (user: Partial<PartnerUser>) => Promise<void>;
}
