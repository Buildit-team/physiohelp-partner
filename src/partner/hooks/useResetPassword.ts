import { useMutation } from 'react-query';
import { resetPassword } from '../services/api-service';

interface ResetPasswordData {
    email: string;
    password: string;
}

export const useResetPassword = () => {
    return useMutation({
        mutationFn: ({ email, password }: ResetPasswordData) => resetPassword(email, password),
    });
};
