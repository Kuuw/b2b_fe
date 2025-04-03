import { Address, Status } from './common';

export interface Company {
    companyId: string;
    companyName: string;
    taxNumber: string;
    email: string;
    website?: string;
    logoUrl?: string;
    address: Address;
    status: Status;
}

export interface CompanyCreate {
    companyName: string;
    taxNumber: string;
    email: string;
    website?: string;
    address: AddressCreate;
}

export interface CompanyUpdate {
    companyId: string;
    companyName: string;
    taxNumber: string;
    addressId: string;
    email: string;
    website?: string;
}

export interface AddressCreate {
    addressTypeId: string;
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    countryId: string;
    phoneNumber?: string;
    isDefault: boolean;
} 