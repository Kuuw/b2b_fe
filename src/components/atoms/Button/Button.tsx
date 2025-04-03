import React from 'react';
import { ButtonProps } from './Button.types';
import ButtonStyles from './Button.styles';
import clsx from 'clsx';

const Button: React.FC<ButtonProps> = ({
    label,
    onClick,
    disabled = false,
    className,
    variant = ButtonStyles.Blue,
}) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={clsx(
                'px-4 py-2 rounded',
                variant,
                className,
                'text-white font-semibold dark:text-white',
                'hover:bg-opacity-80',
                'focus:outline-none focus:ring-2 focus:ring-offset-2')}
            type="button"
            aria-label={label}
            aria-disabled={disabled}
        >
            {label}
        </button >
    );
};

export default Button;