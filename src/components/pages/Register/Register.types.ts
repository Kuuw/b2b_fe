import { UserRegister } from '../../../models/user';

export interface RegisterProps {
    onRegister?: (data: UserRegister) => void;
    className?: string;
} 