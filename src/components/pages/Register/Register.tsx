import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { register, getCompanies } from '../../../services';
import { UserRegister } from '../../../models/user';
import { Company } from '../../../models/company';
import Card from '../../atoms/Card';
import Title from '../../atoms/Title';
import { FormField } from '../../atoms/FormField';
import Button from '../../atoms/Button';
import clsx from 'clsx';

interface RegisterProps {
    className?: string;
}

const Register: React.FC<RegisterProps> = ({ className }) => {
    const navigate = useNavigate();
    const [companies, setCompanies] = useState<Company[]>([]);
    const [formData, setFormData] = useState<UserRegister>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        companyId: '',
    });
    const [error, setError] = useState<string>();

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await getCompanies();
                setCompanies(response);
            } catch (error) {
                console.error('Error fetching companies:', error);
            }
        };
        fetchCompanies();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await register(formData);
            navigate('/login');
        } catch (err) {
            setError('Registration failed. Please try again.');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className={clsx("min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8", className)}>
            <Card className="max-w-md w-full space-y-8" padding="large">
                <Title variant="h2" align="center">
                    Create your account
                </Title>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <FormField
                        label="First Name"
                        name="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                    />
                    <FormField
                        label="Last Name"
                        name="lastName"
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                    />
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
                    <FormField
                        label="Company"
                        name="companyId"
                        type="select"
                        required
                        value={formData.companyId}
                        onChange={handleChange}
                    >
                        <option value="">Select a company</option>
                        {companies.map(company => (
                            <option key={company.companyId} value={company.companyId}>
                                {company.companyName}
                            </option>
                        ))}
                    </FormField>
                    {error && (
                        <div className="text-red-500 text-sm">{error}</div>
                    )}
                    <Button
                        label="Register"
                        onClick={() => {}}
                        className="w-full"
                    />
                </form>
            </Card>
        </div>
    );
};

export default Register; 