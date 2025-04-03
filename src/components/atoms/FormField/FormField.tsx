import React from 'react';
import { FormFieldProps } from './FormField.types';
import {
  containerClasses,
  labelClasses,
  inputWrapperClasses,
  inputClasses,
  errorMessageClasses,
  helperTextClasses,
  iconWrapperClasses,
} from './FormField.styles.ts';

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  helperText,
  required,
  fullWidth,
  startIcon,
  endIcon,
  containerClassName,
  labelClassName,
  inputClassName,
  errorClassName,
  helperTextClassName,
  disabled,
  children,
  type,
  ...props
}) => {
  return (
    <div className={containerClasses(fullWidth)}>
      {label && (
        <label className={labelClasses(labelClassName)}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className={inputWrapperClasses()}>
        {startIcon && (
          <div className={iconWrapperClasses('start')}>{startIcon}</div>
        )}
        {type === 'select' ? (
          <select
            className={inputClasses(!!error, inputClassName)}
            disabled={disabled}
            {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}
          >
            {children}
          </select>
        ) : (
          <input
            type={type}
            className={inputClasses(!!error, inputClassName)}
            disabled={disabled}
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          />
        )}
        {endIcon && <div className={iconWrapperClasses('end')}>{endIcon}</div>}
      </div>
      {error && (
        <span className={errorMessageClasses(errorClassName)}>{error}</span>
      )}
      {helperText && !error && (
        <span className={helperTextClasses(helperTextClassName)}>
          {helperText}
        </span>
      )}
    </div>
  );
};

export default FormField;
