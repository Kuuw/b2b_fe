import React, { useState, useRef } from 'react';
import clsx from 'clsx';

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

const RangeSlider: React.FC<RangeSliderProps> = ({
    min,
    max,
    step = 1,
    value,
    onChange,
    className,
    label,
    formatValue = (val) => val.toString(),
    showInputs = true,
    inputClassName
}) => {
    const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
    const [inputValues, setInputValues] = useState<[string, string]>([
        value[0].toString(),
        value[1].toString()
    ]);
    const sliderRef = useRef<HTMLDivElement>(null);
    const dragStartValue = useRef<[number, number]>(value);

    // Update input values when prop value changes
    React.useEffect(() => {
        setInputValues([value[0].toString(), value[1].toString()]);
    }, [value]);

    const calculateValue = (clientX: number): number => {
        if (!sliderRef.current) return value[0];
        const rect = sliderRef.current.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        return Math.round((min + (max - min) * percent) / step) * step;
    };

    const handleStart = (e: React.MouseEvent | React.TouchEvent, thumb: 'min' | 'max') => {
        e.preventDefault();
        dragStartValue.current = value;
        setIsDragging(thumb);
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
        if (!isDragging || !sliderRef.current) return;

        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const newValue = calculateValue(clientX);

        if (isDragging === 'min') {
            const newMin = Math.min(Math.max(min, newValue), dragStartValue.current[1] - step);
            onChange([newMin, dragStartValue.current[1]]);
        } else {
            const newMax = Math.max(Math.min(max, newValue), dragStartValue.current[0] + step);
            onChange([dragStartValue.current[0], newMax]);
        }
    }; const handleEnd = () => {
        setIsDragging(null);
    };

    const handleInputChange = (index: 0 | 1, inputValue: string) => {
        const newInputValues: [string, string] = [...inputValues];
        newInputValues[index] = inputValue;
        setInputValues(newInputValues);
    };

    const handleInputBlur = (index: 0 | 1) => {
        const inputValue = inputValues[index];
        const numValue = parseFloat(inputValue);

        if (isNaN(numValue)) {
            // Reset to current value if invalid
            setInputValues([value[0].toString(), value[1].toString()]);
            return;
        }

        let clampedValue = Math.max(min, Math.min(max, numValue));
        clampedValue = Math.round(clampedValue / step) * step;

        const newValue: [number, number] = [...value];

        if (index === 0) {
            // Min value - ensure it doesn't exceed max
            newValue[0] = Math.min(clampedValue, value[1] - step);
        } else {
            // Max value - ensure it doesn't go below min
            newValue[1] = Math.max(clampedValue, value[0] + step);
        }

        onChange(newValue);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent, index: 0 | 1) => {
        if (e.key === 'Enter') {
            handleInputBlur(index);
        }
    };

    React.useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMove);
            document.addEventListener('mouseup', handleEnd);
            document.addEventListener('touchmove', handleMove);
            document.addEventListener('touchend', handleEnd);
        }
        return () => {
            document.removeEventListener('mousemove', handleMove);
            document.removeEventListener('mouseup', handleEnd);
            document.removeEventListener('touchmove', handleMove);
            document.removeEventListener('touchend', handleEnd);
        };
    }, [isDragging, value, min, max, step]);

    const minPercent = ((value[0] - min) / (max - min)) * 100;
    const maxPercent = ((value[1] - min) / (max - min)) * 100; return (
        <div className={clsx('w-full', className)}>
            {label && (
                <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">{label}</span>
                    {!showInputs && (
                        <span className="text-sm text-gray-600">
                            {formatValue(value[0])} - {formatValue(value[1])}
                        </span>
                    )}
                </div>
            )}

            {showInputs && (
                <div className="flex justify-between items-center mb-4 gap-4">
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600 font-medium">Min:</label>
                        <input
                            type="number"
                            value={inputValues[0]}
                            onChange={(e) => handleInputChange(0, e.target.value)}
                            onBlur={() => handleInputBlur(0)}
                            onKeyDown={(e) => handleInputKeyDown(e, 0)}
                            min={min}
                            max={max}
                            step={step}
                            className={clsx(
                                'w-20 px-2 py-1 text-sm border border-gray-300 text-gray-900 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                                inputClassName
                            )}
                        />
                    </div>
                    <span className="text-gray-400">-</span>
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600 font-medium">Max:</label>
                        <input
                            type="number"
                            value={inputValues[1]}
                            onChange={(e) => handleInputChange(1, e.target.value)}
                            onBlur={() => handleInputBlur(1)}
                            onKeyDown={(e) => handleInputKeyDown(e, 1)}
                            min={min}
                            max={max}
                            step={step}
                            className={clsx(
                                'w-20 px-2 py-1 text-sm border border-gray-300 text-gray-900 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                                inputClassName
                            )}
                        />
                    </div>
                </div>
            )}

            <div
                ref={sliderRef}
                className="relative h-2 bg-gray-200 rounded-full"
            >
                <div
                    className="absolute h-full bg-blue-500 rounded-full"
                    style={{
                        left: `${minPercent}%`,
                        width: `${maxPercent - minPercent}%`
                    }}
                />
                <div
                    className="absolute w-4 h-4 bg-white border-2 border-blue-500 rounded-full -top-1 cursor-pointer hover:bg-blue-50 transition-colors"
                    style={{ left: `calc(${minPercent}% - 8px)` }}
                    onMouseDown={(e) => handleStart(e, 'min')}
                    onTouchStart={(e) => handleStart(e, 'min')}
                />
                <div
                    className="absolute w-4 h-4 bg-white border-2 border-blue-500 rounded-full -top-1 cursor-pointer hover:bg-blue-50 transition-colors"
                    style={{ left: `calc(${maxPercent}% - 8px)` }}
                    onMouseDown={(e) => handleStart(e, 'max')}
                    onTouchStart={(e) => handleStart(e, 'max')}
                />
            </div>
        </div>
    );
};

export default RangeSlider; 