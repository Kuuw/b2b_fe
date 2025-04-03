import { InputHTMLAttributes } from 'react';

export interface SearchFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    onSearch: (value: string) => void;
    placeholder?: string;
    className?: string;
} 