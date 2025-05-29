import React from 'react';
import { DatePicker } from '../../atoms/DatePicker';
import clsx from 'clsx';

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

const DateRange: React.FC<DateRangeProps> = ({
    startDate,
    endDate,
    onChange,
    className,
    label,
    error,
    helperText,
    clearable = true
}) => {
    const handleStartDateChange = (date: Date | null) => {
        const newStartDate = date ? new Date(date.setHours(0, 0, 0, 0)) : null;
        onChange(newStartDate, endDate);
    };

    const handleEndDateChange = (date: Date | null) => {
        const newEndDate = date ? new Date(date.setHours(23, 59, 59, 999)) : null;
        onChange(startDate, newEndDate);
    };

    return (
        <div className={clsx('flex flex-col gap-3', className)}>
            {label && (
                <label className="text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <div className="flex items-center gap-3">
                <div className="flex-1">
                    <DatePicker
                        value={startDate}
                        onChange={handleStartDateChange}
                        placeholder="Start date"
                        error={!!error}
                        className="w-full"
                        maxDate={endDate || undefined}
                        clearable={clearable}
                    />
                </div>
                <span className="text-gray-500 font-medium px-2 select-none">to</span>
                <div className="flex-1">
                    <DatePicker
                        value={endDate}
                        onChange={handleEndDateChange}
                        placeholder="End date"
                        error={!!error}
                        className="w-full"
                        minDate={startDate || undefined}
                        clearable={clearable}
                    />
                </div>
            </div>
            {error && (
                <span className="text-sm text-red-600 font-medium">{error}</span>
            )}
            {helperText && !error && (
                <span className="text-sm text-gray-500">{helperText}</span>
            )}
        </div>
    );
};

export default DateRange; 