export interface RangeSliderProps {
    min: number;
    max: number;
    step?: number;
    value: [number, number];
    onChange: (value: [number, number]) => void;
    className?: string;
    label?: string;
    formatValue?: (value: number) => string;
    showInputs?: boolean;
    inputClassName?: string;
}