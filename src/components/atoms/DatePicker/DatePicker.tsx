import React, { useState, useRef, useEffect } from 'react';
import { FiCalendar, FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';
import clsx from 'clsx';

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

const DatePicker: React.FC<DatePickerProps> = ({
    value,
    onChange,
    placeholder = "Select date",
    error = false,
    disabled = false,
    className,
    minDate,
    maxDate,
    clearable = true
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(value || new Date());
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const formatDate = (date: Date | null) => {
        if (!date) return '';
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const isDateDisabled = (date: Date) => {
        if (minDate && date < minDate) return true;
        if (maxDate && date > maxDate) return true;
        return false;
    };

    const isSameDay = (date1: Date, date2: Date) => {
        return date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear();
    };

    const isToday = (date: Date) => {
        return isSameDay(date, new Date());
    }; const handleDateSelect = (day: number) => {
        const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        if (!isDateDisabled(selectedDate)) {
            onChange(selectedDate);
            setIsOpen(false);
        }
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(null);
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
        setCurrentMonth(prev => {
            const newDate = new Date(prev);
            if (direction === 'prev') {
                newDate.setMonth(prev.getMonth() - 1);
            } else {
                newDate.setMonth(prev.getMonth() + 1);
            }
            return newDate;
        });
    };

    const renderCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentMonth);
        const firstDay = getFirstDayOfMonth(currentMonth);
        const days = [];        // Empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="w-12 h-12" />);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
            const isSelected = value && isSameDay(date, value);
            const isCurrentDay = isToday(date);
            const isDisabled = isDateDisabled(date);

            days.push(
                <button
                    key={day}
                    type="button"
                    onClick={() => handleDateSelect(day)}
                    disabled={isDisabled}
                    className={clsx(
                        'w-10 h-10 flex items-center justify-center text-sm rounded-lg transition-colors font-medium',
                        {
                            'bg-blue-600 text-white hover:bg-blue-700': isSelected,
                            'text-blue-600 font-bold bg-blue-50': isCurrentDay && !isSelected,
                            'text-gray-700 hover:bg-blue-50 hover:text-blue-600 bg-white': !isSelected && !isCurrentDay && !isDisabled,
                            'text-gray-300 cursor-not-allowed': isDisabled,
                        }
                    )}
                >
                    {day}
                </button>
            );
        }

        return days;
    };

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    return (
        <div ref={containerRef} className={clsx('relative', className)}>
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={clsx(
                    'w-full px-4 py-3 text-left border rounded-lg bg-white',
                    'flex items-center justify-between',
                    'transition-all duration-200',
                    'min-h-[44px]',
                    {
                        'border-red-300 focus:border-red-500 focus:ring-red-200': error,
                        'border-gray-300 focus:border-blue-500 focus:ring-blue-200': !error,
                        'bg-gray-50 text-gray-400 cursor-not-allowed': disabled,
                        'hover:border-blue-400 hover:shadow-sm': !disabled && !error,
                    },
                    'focus:outline-none focus:ring-2 focus:ring-opacity-50'
                )}
            >
                <span className={clsx('text-sm font-medium', { 'text-gray-500': !value, 'text-gray-900': value })}>
                    {value ? formatDate(value) : placeholder}
                </span>
                <div className="flex items-center gap-2">
                    {clearable && value && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors bg-white hover:bg-gray-50"
                            title="Clear date"
                        >
                            <FiX className="w-4 h-4" />
                        </button>
                    )}
                    <FiCalendar className={clsx('w-5 h-5', { 'text-gray-400': !value, 'text-blue-500': value })} />
                </div>
            </button>{isOpen && (
                <div className="absolute z-50 top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg min-w-[320px]">
                    <div className="p-4">
                        {/* Calendar Header */}
                        <div className="flex items-center justify-between mb-4">
                            <button
                                type="button"
                                onClick={() => navigateMonth('prev')}
                                className="p-2 text-gray-600 hover:bg-gray-100 bg-white hover:text-gray-800 rounded-md transition-colors"
                            >
                                <FiChevronLeft className="w-5 h-5" />
                            </button>
                            <h3 className="text-lg font-semibold text-gray-900">
                                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                            </h3>
                            <button
                                type="button"
                                onClick={() => navigateMonth('next')}
                                className="p-2 text-gray-600 hover:bg-gray-100 bg-white hover:text-gray-800 rounded-md transition-colors"
                            >
                                <FiChevronRight className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Week Days Header */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {weekDays.map(day => (
                                <div key={day} className="w-12 h-10 flex items-center justify-center text-sm font-medium text-gray-600">
                                    {day}
                                </div>
                            ))}
                        </div>                        {/* Calendar Days */}
                        <div className="grid grid-cols-7 gap-1 mb-4">
                            {renderCalendarDays()}
                        </div>

                        {/* Clear button */}
                        {clearable && value && (
                            <div className="pt-2 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => {
                                        onChange(null);
                                        setIsOpen(false);
                                    }}
                                    className="w-full px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md transition-colors"
                                >
                                    Clear Selection
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DatePicker;
