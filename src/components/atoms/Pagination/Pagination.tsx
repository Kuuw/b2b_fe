import React from 'react';
import { PaginationProps } from './Pagination.types';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import clsx from 'clsx';

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    className
}) => {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div className={clsx('flex items-center justify-center space-x-2', className)}>
            <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className={clsx(
                    'p-2 rounded-md',
                    currentPage === 1
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-600 hover:bg-gray-100'
                )}
            >
                <FiChevronLeft className="w-5 h-5" />
            </button>

            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={clsx(
                        'px-3 py-1 rounded-md',
                        currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                    )}
                >
                    {page}
                </button>
            ))}

            <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={clsx(
                    'p-2 rounded-md',
                    currentPage === totalPages
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-600 hover:bg-gray-100'
                )}
            >
                <FiChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
};

export default Pagination; 