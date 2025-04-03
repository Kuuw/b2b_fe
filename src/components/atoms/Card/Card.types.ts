import { ReactNode } from 'react';

export interface CardProps {
    children: ReactNode;
    className?: string;
    padding?: 'none' | 'small' | 'medium' | 'large';
    elevation?: 'none' | 'low' | 'medium' | 'high';
} 