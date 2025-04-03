import { Status } from './status';
import { User } from './user';
import { Product } from './product';
import { Invoice } from './invoice';

export interface OrderItem {
    orderItemId: string;
    orderId: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    product: Product;
}

export interface Order {
    orderId: string;
    shippingAddressId: string;
    invoiceAddressId: string;
    invoices: Invoice[];
    orderItems: OrderItem[];
    status: Status;
    user: User;
}

export interface OrderCreate {
    orderId: string;
    userId: string;
    statusId: string;
    shippingAddressId: string;
    invoiceAddressId: string;
    orderItems: OrderItemCreate[];
}

export interface OrderUpdate {
    orderId: string;
    userId: string;
    statusId: string;
    shippingAddressId: string;
    invoiceAddressId: string;
    orderItems: OrderItemCreate[];
}

export interface OrderItemCreate {
    productId: string;
    quantity: number;
    unitPrice: number;
} 