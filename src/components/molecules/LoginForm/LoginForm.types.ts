import { UserLogin } from '../../../models/user';

export interface LoginFormProps {
    onSubmit: (data: UserLogin) => void;
    error?: string;
} 