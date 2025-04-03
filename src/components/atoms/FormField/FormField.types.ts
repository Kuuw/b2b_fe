import { InputHTMLAttributes, SelectHTMLAttributes, ReactNode } from 'react';

type BaseFormFieldProps = {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  fullWidth?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
  helperTextClassName?: string;
};

export type FormFieldProps = BaseFormFieldProps & (
  | (InputHTMLAttributes<HTMLInputElement> & { type?: 'text' | 'email' | 'password' | 'tel' })
  | (SelectHTMLAttributes<HTMLSelectElement> & { type: 'select' })
);

export default FormFieldProps;