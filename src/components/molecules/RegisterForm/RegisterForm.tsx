import React, { useState } from 'react';
import { UserRegister } from '../../../models/user';
import { FormField } from '../../atoms/FormField';
import Button from '../../atoms/Button/Button';
import ButtonStyles from '../../atoms/Button/Button.styles';
import { RegisterFormProps } from './RegisterForm.types';
import clsx from 'clsx';

const RegisterForm: React.FC<RegisterFormProps> = ({
    onSubmit,
    className
}) => {
    const [formData, setFormData] = useState<UserRegister>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phoneNumber: '',
        companyId: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) {
            e.preventDefault();
        }
        onSubmit(formData);
    };

    return (
        <form className={clsx("mt-8 space-y-6", className)} onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                        label="First name"
                        type="text"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        fullWidth
                    />
                    <FormField
                        label="Last name"
                        type="text"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        fullWidth
                    />
                </div>
                
                <FormField
                    label="Email address"
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    fullWidth
                />
                
                <FormField
                    label="Password"
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    fullWidth
                />
                
                <FormField
                    label="Phone number"
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    fullWidth
                />
                
                <FormField
                    label="Company ID"
                    type="text"
                    name="companyId"
                    required
                    value={formData.companyId}
                    onChange={handleInputChange}
                    fullWidth
                />
            </div>

            <div>
                <Button
                    label="Register"
                    onClick={() => handleSubmit()}
                    variant={ButtonStyles.Blue}
                    className="w-full"
                />
            </div>
        </form>
    );
};

export default RegisterForm; 