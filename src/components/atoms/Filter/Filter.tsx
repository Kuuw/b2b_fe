import React from 'react';
import { FilterProps } from './Filter.types';
import { FormField } from '../FormField';
import clsx from 'clsx';

const Filter: React.FC<FilterProps> = ({
    options,
    value,
    onChange,
    placeholder = 'Filter...',
    className
}) => {
    return (
        <FormField
            type="select"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={clsx('w-full max-w-xs text-gray-900', className)}
        >
            <option value="" className="text-gray-900">{placeholder}</option>
            {options.map((option) => (
                <option key={option.value} value={option.value} className="text-gray-900">
                    {option.label}
                </option>
            ))}
        </FormField>
    );
};

export default Filter; 