export interface Status {
    statusId: string;
    statusName: string;
    description?: string;
}

export interface Address {
    addressId: string;
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    countryId: string;
    phoneNumber?: string;
    isDefault: boolean;
    addressType: AddressType;
    country: Country;
}

export interface AddressType {
    addressTypeId: string;
    addressTypeName: string;
}

export interface Country {
    countryId: string;
    countryName: string;
    phoneCode: number;
} 