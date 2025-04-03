import { Status } from './status';
import { Company } from './company';
import { Role } from './role';

export interface User {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    profileImageUrl?: string;
    company: Company;
    role: Role;
    status: Status;
}

export interface UserRegister {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber?: string;
    companyId: string;
}

export interface UserLogin {
    email: string;
    password: string;
}

export interface UserCreate {
    companyId: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    passwordHash: string;
    roleId: string;
    statusId: string;
    profileImageUrl?: string;
}

export interface UserUpdate extends UserCreate {
    userId: string;
} 