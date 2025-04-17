interface ButtonProps {
    label: string;
    onClick?: (e?: React.MouseEvent) => void;
    disabled?: boolean;
    className?: string;
    variant?: ButtonStyles;
    type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({ 
    label, 
    onClick, 
    disabled = false, 
    className = '',
    variant = ButtonStyles.Primary,
    type = 'button'
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={clsx(
                'px-4 py-2 rounded-md font-medium transition-colors duration-200',
                variant,
                disabled && 'opacity-50 cursor-not-allowed',
                className
            )}
        >
            {label}
        </button>
    );
}; 