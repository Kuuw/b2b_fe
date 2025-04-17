import React from 'react';
import { Button } from '../../atoms';
import ButtonStyles from '../../atoms/Button/Button.styles';
import clsx from 'clsx';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    onSubmit?: () => void;
    submitLabel?: string;
    className?: string;
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    onSubmit,
    submitLabel = 'Submit',
    className,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={clsx('bg-white rounded-lg shadow-xl w-full max-w-md', className)}>
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">{title}</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                    <div className="mb-6">{children}</div>
                    <div className="flex justify-end space-x-4">
                        <Button
                            label="Cancel"
                            onClick={onClose}
                            variant={ButtonStyles.Gray}
                        />
                        {onSubmit && (
                            <Button
                                label={submitLabel}
                                onClick={onSubmit}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal; 