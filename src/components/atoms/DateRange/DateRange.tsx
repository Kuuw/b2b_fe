import React from 'react';
import { FormField } from '../FormField';
import { FiCalendar } from 'react-icons/fi';
import clsx from 'clsx';

export interface DateRangeProps {
    startDate: Date | null;
    endDate: Date | null;
    onChange: (startDate: Date | null, endDate: Date | null) => void;
    className?: string;
    label?: string;
    error?: string;
    helperText?: string;
}

const DateRange: React.FC<DateRangeProps> = ({
    startDate,
    endDate,
    onChange,
    className,
    label,
    error,
    helperText
}) => {
    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const newStartDate = value ? new Date(new Date(value).setHours(0, 0, 0, 0)) : null;
        onChange(newStartDate, endDate);
    };

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const newEndDate = value ? new Date(new Date(value).setHours(23, 59, 59, 999)) : null;
        onChange(startDate, newEndDate);
    };

    const formatDateForInput = (date: Date | null) => {
        if (!date) return '';
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    };

    return (
        <div className={clsx('flex flex-col gap-2', className)}>
            {label && (
                <label className="text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <div className="flex items-center gap-2">
                <FormField
                    type="date"
                    value={formatDateForInput(startDate)}
                    onChange={handleStartDateChange}
                    placeholder="Start date"
                    error={error}
                    className="w-full"
                />
                <span className="text-gray-500">to</span>
                <FormField
                    type="date"
                    value={formatDateForInput(endDate)}
                    onChange={handleEndDateChange}
                    placeholder="End date"
                    error={error}
                    className="w-full"
                />
            </div>
            {helperText && !error && (
                <span className="text-sm text-gray-500">{helperText}</span>
            )}
        </div>
    );
};

export default DateRange; 