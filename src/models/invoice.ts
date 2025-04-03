import { Company } from './company';
import { Order } from './order';
import { Status } from './common';

export interface Payment {
    paymentId: string;
    paymentDate: Date;
    amount: number;
    currency: string;
    transactionReference: string;
    invoice: Invoice;
}

export interface Invoice {
    invoiceId: string;
    totalAmount: number;
    taxAmount: number;
    currency: string;
    statusId: string;
    company: Company;
    order: Order;
    payments: Payment[];
}

export interface InvoiceCreate {
    orderId: string;
    companyId: string;
    invoiceAddressId: string;
    totalAmount: number;
    taxAmount: number;
    currency: string;
    statusId: string;
}

export interface InvoiceUpdate extends InvoiceCreate {
    invoiceId: string;
}

export interface PaymentCreate {
    invoiceId: string;
    paymentDate: Date;
    amount: number;
    currency: string;
    transactionReference: string;
}

export interface PaymentUpdate extends PaymentCreate {
    paymentId: string;
} 