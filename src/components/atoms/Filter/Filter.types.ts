export interface FilterOption {
    value: string;
    label: string;
}

export interface FilterProps {
    options: FilterOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
} 