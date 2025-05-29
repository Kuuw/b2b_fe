export interface DatePickerProps {
    value: Date | null;
    onChange: (date: Date | null) => void;
    placeholder?: string;
    error?: boolean;
    disabled?: boolean;
    className?: string;
    minDate?: Date;
    maxDate?: Date;
    clearable?: boolean;
}
