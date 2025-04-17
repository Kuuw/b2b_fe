import ButtonStyles from "./Button.styles";

export interface ButtonProps {
    label: string;
    onClick: (e?: React.MouseEvent) => void;
    disabled?: boolean;
    className?: string;
    variant?: ButtonStyles;
}