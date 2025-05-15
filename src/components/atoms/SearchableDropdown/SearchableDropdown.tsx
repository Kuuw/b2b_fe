import React, { useState, useEffect, useRef } from 'react';
import { FormField } from '../FormField';
import { FiSearch, FiChevronDown } from 'react-icons/fi';
import clsx from 'clsx';

export interface SearchableDropdownOption {
    value: string;
    label: string;
}

export interface SearchableDropdownProps {
    options: SearchableDropdownOption[];
    value: string[];
    onChange: (values: string[]) => void;
    placeholder?: string;
    className?: string;
    onSearch?: (query: string) => void;
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
    options,
    value,
    onChange,
    placeholder = 'Select...',
    className,
    onSearch
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        onSearch?.(query);
    };

    const handleOptionClick = (optionValue: string) => {
        const newValue = value.includes(optionValue)
            ? value.filter(v => v !== optionValue)
            : [...value, optionValue];
        onChange(newValue);
    };

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectedLabels = options
        .filter(option => value.includes(option.value))
        .map(option => option.label)
        .join(', ');

    return (
        <div className={clsx('relative', className)} ref={dropdownRef}>
            <div
                className="flex items-center justify-between w-full px-3 py-2 text-sm border rounded-md cursor-pointer bg-white"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={clsx('truncate', !selectedLabels && 'text-gray-500')}>
                    {selectedLabels || placeholder}
                </span>
                <FiChevronDown className={clsx('w-5 h-5 text-gray-400 transition-transform', isOpen && 'transform rotate-180 ml-auto mr-0')} />
            </div>

            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                    <div className="pt-2 pb-2 border-b">
                        <FormField
                            type="text"
                            value={searchQuery}
                            onChange={handleSearch}
                            placeholder="Search..."
                            startIcon={<FiSearch className="w-5 h-5 text-gray-400" />}
                            className="w-full ml-8"
                        />
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                        {filteredOptions.map(option => (
                            <div
                                key={option.value}
                                className={clsx(
                                    'px-3 py-2 cursor-pointer hover:bg-gray-100',
                                    value.includes(option.value) && 'bg-blue-50'
                                )}
                                onClick={() => handleOptionClick(option.value)}
                            >
                                {option.label}
                            </div>
                        ))}
                        {filteredOptions.length === 0 && (
                            <div className="px-3 py-2 text-gray-500 text-sm">
                                No options found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchableDropdown; 