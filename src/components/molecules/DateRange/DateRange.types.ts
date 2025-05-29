export interface DateRangeProps {
    startDate: Date | null;
    endDate: Date | null;
    onChange: (startDate: Date | null, endDate: Date | null) => void;
    className?: string;
    label?: string;
    error?: string;
    helperText?: string;
    clearable?: boolean;
}