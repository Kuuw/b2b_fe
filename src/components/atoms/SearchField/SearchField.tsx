import React, { useState, useCallback } from 'react';
import { SearchFieldProps } from './SearchField.types';
import { FormField } from '../FormField';
import { FiSearch } from 'react-icons/fi';
import clsx from 'clsx';
import debounce from 'lodash/debounce';

const SearchField: React.FC<SearchFieldProps> = ({
    onSearch,
    placeholder = 'Search...',
    className,
    ...props
}) => {
    const [value, setValue] = useState('');

    const debouncedSearch = useCallback(
        debounce((searchValue: string) => {
            onSearch(searchValue);
        }, 300),
        [onSearch]
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setValue(newValue);
        debouncedSearch(newValue);
    };

    return (
        <FormField
            type="text"
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            startIcon={<FiSearch className="w-5 h-5 text-gray-400" />}
            className={clsx('w-full max-w-md text-gray-900', className)}
            {...props}
        />
    );
};

export default SearchField; 