import { clsx } from 'clsx';

export const containerClasses = (fullWidth?: boolean) =>
  clsx('flex flex-col gap-1', {
    'w-full': fullWidth,
  });

export const labelClasses = (className?: string) =>
  clsx('text-sm font-medium text-gray-700', className);

export const inputWrapperClasses = () => 'relative flex items-center';

export const inputClasses = (hasError?: boolean, className?: string) =>
  clsx(
    'w-full px-3 py-2 text-sm border rounded-md transition-colors duration-200',
    'text-gray-900 bg-white',
    'focus:outline-none focus:ring-2',
    {
      'border-red-500 focus:border-red-500 focus:ring-red-200': hasError,
      'border-gray-300 focus:border-blue-500 focus:ring-blue-200': !hasError,
      'bg-gray-50 cursor-not-allowed': false, // This will be controlled by the disabled prop
    },
    className
  );

export const errorMessageClasses = (className?: string) =>
  clsx('text-xs text-red-500 mt-1', className);

export const helperTextClasses = (className?: string) =>
  clsx('text-xs text-gray-500 mt-1', className);

export const iconWrapperClasses = (position: 'start' | 'end') =>
  clsx('absolute flex items-center justify-center text-gray-400', {
    'left-3': position === 'start',
    'right-3': position === 'end',
  }); 