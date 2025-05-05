import React, { useState, useEffect } from 'react';
import { Company, CompanyCreate, CompanyUpdate, AddressCreate } from '../../../../models/company';
import { createCompany, updateCompany } from '../../../../services/company.service';
import Button from '../../../atoms/Button';
import ButtonStyles from '../../../atoms/Button/Button.styles';
import { getCountries } from '@/services';
import { Country } from '@/models/common';

interface CompanyFormProps {
    company: Company | null;
    onSubmit: () => void;
}

const CompanyForm: React.FC<CompanyFormProps> = ({ company, onSubmit }) => {
    const [formData, setFormData] = useState<CompanyCreate | CompanyUpdate>({
        companyName: '',
        taxNumber: '',
        email: '',
        website: '',
        address: {
            addressTypeId: '3CE78522-99CB-4715-ADD2-2300F6AA706F',
            streetAddress: '',
            city: '',
            state: '',
            postalCode: '',
            countryId: '',
            phoneNumber: '',
            isDefault: true
        }
    });
    const [countries, setCountries] = useState<Country[]>([]);
    const [countryId, setCountryId] = useState('');

    const loadCountries = async () => {
        try {
            const data = await getCountries();
            setCountries(data);
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    };

    useEffect(() => {
        loadCountries();
        if (company) {
            // For update, we only need the basic company info and addressId
            setFormData({
                companyId: company.companyId,
                companyName: company.companyName,
                taxNumber: company.taxNumber,
                email: company.email,
                website: company.website,
                addressId: company.address.addressId,
            });
        } else {
            // For create, we need the full address object
            setFormData({
                companyName: '',
                taxNumber: '',
                email: '',
                website: '',
                address: {
                    addressTypeId: '3CE78522-99CB-4715-ADD2-2300F6AA706F',
                    streetAddress: '',
                    city: '',
                    state: '',
                    postalCode: '',
                    countryId: countryId,
                    phoneNumber: '',
                    isDefault: true
                }
            });
        }
    }, [company]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1];
            setFormData(prev => {
                if ('address' in prev) {
                    return {
                        ...prev,
                        address: {
                            ...(prev as CompanyCreate).address,
                            [addressField]: value
                        }
                    };
                }
                return prev;
            });
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (company) {
                await updateCompany(formData as CompanyUpdate);
            } else {
                await createCompany(formData as CompanyCreate);
            }
            onSubmit();
        } catch (error) {
            console.error('Error saving company:', error);
        }
    };

    const isCreateMode = !company;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                    Company Name
                </label>
                <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
            </div>

            <div>
                <label htmlFor="taxNumber" className="block text-sm font-medium text-gray-700">
                    Tax Number
                </label>
                <input
                    type="text"
                    id="taxNumber"
                    name="taxNumber"
                    value={formData.taxNumber}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
            </div>

            <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                    Website
                </label>
                <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
            </div>

            {isCreateMode && (
                <div className="border-t pt-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>

                    <div>
                        <label htmlFor="address.streetAddress" className="block text-sm font-medium text-gray-700">
                            Street Address
                        </label>
                        <input
                            type="text"
                            id="address.streetAddress"
                            name="address.streetAddress"
                            value={(formData as CompanyCreate).address.streetAddress}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <label htmlFor="address.city" className="block text-sm font-medium text-gray-700">
                                City
                            </label>
                            <input
                                type="text"
                                id="address.city"
                                name="address.city"
                                value={(formData as CompanyCreate).address.city}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="address.state" className="block text-sm font-medium text-gray-700">
                                State
                            </label>
                            <input
                                type="text"
                                id="address.state"
                                name="address.state"
                                value={(formData as CompanyCreate).address.state}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <label htmlFor="address.postalCode" className="block text-sm font-medium text-gray-700">
                                Postal Code
                            </label>
                            <input
                                type="text"
                                id="address.postalCode"
                                name="address.postalCode"
                                value={(formData as CompanyCreate).address.postalCode}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="address.phoneNumber" className="block text-sm font-medium text-gray-700">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                id="address.phoneNumber"
                                name="address.phoneNumber"
                                value={(formData as CompanyCreate).address.phoneNumber || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Country</label>
                            <select
                                value={(formData as CompanyCreate).address.countryId}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        address: {
                                            ...(prev as CompanyCreate).address,
                                            countryId: e.target.value
                                        }
                                    }))
                                }
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select a country</option>
                                {countries.map((country) => (
                                    <option key={country.countryId} value={country.countryId}>
                                        {country.countryName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-end space-x-3">
                <Button
                    label="Cancel"
                    onClick={onSubmit}
                    variant={ButtonStyles.Gray}
                />
                <Button
                    label={company ? "Update" : "Create"}
                    onClick={() => handleSubmit(new Event('submit') as any)}
                />
            </div>
        </form>
    );
};

export default CompanyForm; 