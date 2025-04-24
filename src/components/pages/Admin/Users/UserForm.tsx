import React, { useEffect, useState } from 'react';
import { FormField } from '../../../atoms/FormField';
import Button from '../../../atoms/Button';
import { User, UserCreate, UserUpdate } from '../../../../models/user';
import { getCompanies } from '../../../../services/company.service';
import { getRoles } from '../../../../services/role.service';
import { getStatuses } from '../../../../services/status.service';
import { Company } from '../../../../models/company';
import { Role } from '../../../../models/role';
import { Status } from '../../../../models/status';
import { createUser, updateUser } from '../../../../services/user.service';

interface UserFormProps {
    user: User | null;
    onSubmit: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSubmit }) => {
    const [formData, setFormData] = useState<UserCreate>({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        companyId: '',
        roleId: '',
        statusId: '1', // Active by default
        passwordHash: '',
    });

    const [companies, setCompanies] = useState<Company[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [statuses, setStatuses] = useState<Status[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        loadCompanies();
        loadRoles();
        loadStatuses();
        if (user) {
            setFormData({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber || '',
                companyId: user.company.companyId,
                roleId: user.role.roleId,
                statusId: user.status.statusId,
                passwordHash: '', // Don't set password for edit
            });
        }
    }, [user]);

    const loadCompanies = async () => {
        try {
            const data = await getCompanies();
            setCompanies(data);
        } catch (error) {
            console.error('Error loading companies:', error);
        }
    };

    const loadRoles = async () => {
        try {
            const data = await getRoles();
            setRoles(data);
        } catch (error) {
            console.error('Error loading roles:', error);
        }
    };

    const loadStatuses = async () => {
        try {
            const data = await getStatuses();
            setStatuses(data);
        } catch (error) {
            console.error('Error loading statuses:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (user) {
                const updatedUser: UserUpdate = {
                    ...formData,
                    userId: user.userId,
                };
                await updateUser(updatedUser);
            } else {
                await createUser(formData);
            }
            onSubmit();
        } catch (error) {
            console.error('Error saving user:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
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
                label="Email"
                type="email"
                name="email"
                required
                value={formData.email}
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
                label="Company"
                type="select"
                name="companyId"
                required
                value={formData.companyId}
                onChange={handleInputChange}
                fullWidth
            >
                <option value="">Select a company</option>
                {companies.map(company => (
                    <option key={company.companyId} value={company.companyId}>
                        {company.companyName}
                    </option>
                ))}
            </FormField>

            <FormField
                label="Role"
                type="select"
                name="roleId"
                required
                value={formData.roleId}
                onChange={handleInputChange}
                fullWidth
            >
                <option value="">Select a role</option>
                {roles.map(role => (
                    <option key={role.roleId} value={role.roleId}>
                        {role.roleName}
                    </option>
                ))}
            </FormField>

            <FormField
                label="Status"
                type="select"
                name="statusId"
                required
                value={formData.statusId}
                onChange={handleInputChange}
                fullWidth
            >
                <option value="">Select a status</option>
                {statuses.map(status => (
                    <option key={status.statusId} value={status.statusId}>
                        {status.statusName}
                    </option>
                ))}
            </FormField>

            {!user && (
                <FormField
                    label="Password"
                    type="password"
                    name="passwordHash"
                    required
                    value={formData.passwordHash}
                    onChange={handleInputChange}
                    fullWidth
                />
            )}

            <div className="flex justify-end space-x-4">
                <Button
                    label={isLoading ? "Saving..." : (user ? "Update" : "Create")}
                    disabled={isLoading}
                    onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
                />
            </div>
        </form>
    );
};

export default UserForm; 