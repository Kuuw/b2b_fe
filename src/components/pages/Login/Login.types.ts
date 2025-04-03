import { UserLogin } from '../../../models/user';

export interface LoginProps {
    onLogin?: (data: UserLogin) => void;
    className?: string;
} 