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
}

const RangeSlider: React.FC<RangeSliderProps> = ({
    min,
    max,
    step = 1,
    value,
    onChange,
    className,
    label,
    formatValue = (val) => val.toString()
}) => {
    const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
    const sliderRef = useRef<HTMLDivElement>(null);
    const dragStartValue = useRef<[number, number]>(value);

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
    };

    const handleEnd = () => {
        setIsDragging(null);
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
    const maxPercent = ((value[1] - min) / (max - min)) * 100;

    return (
        <div className={clsx('w-full', className)}>
            {label && (
                <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">{label}</span>
                    <span className="text-sm text-gray-600">
                        {formatValue(value[0])} - {formatValue(value[1])}
                    </span>
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