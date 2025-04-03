import React, { useState } from 'react';
import { UserLogin } from '../../../models/user';
import { FormField } from '../../atoms/FormField';
import Button from '../../atoms/Button';
import { LoginFormProps } from './LoginForm.types';

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, error }) => {
    const [formData, setFormData] = useState<UserLogin>({
        email: '',
        password: ''
    });

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) {
            e.preventDefault();
        }
        onSubmit(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
                label="Email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
            />
            <FormField
                label="Password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
            />
            {error && (
                <div className="text-red-500 text-sm">{error}</div>
            )}
            <Button
                label="Sign in"
                onClick={handleSubmit}
                className="w-full"
            />
        </form>
    );
};

export default LoginForm; 