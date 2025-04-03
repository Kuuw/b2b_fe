import { UserRegister } from '../../../models/user';

export interface RegisterFormProps {
    onSubmit: (data: UserRegister) => void;
    className?: string;
} 