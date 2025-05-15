export interface SearchableDropdownOption {
    value: string;
    label: string;
}

export interface SearchableDropdownProps {
    options: SearchableDropdownOption[];
    value: string[];
    onChange: (values: string[]) => void;
    placeholder?: string;
    className?: string;
    onSearch?: (query: string) => void;
} 