import ButtonStyles from "./Button.styles";

export interface ButtonProps {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    className?: string;
    variant?: ButtonStyles;
}