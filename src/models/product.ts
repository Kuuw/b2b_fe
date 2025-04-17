import { Category } from './category';
import { Status } from './status';

export interface ProductImage {
    productImageId: string;
    imageUrl: string;
}

export interface ProductStock {
    productStockId: string;
    quantity: number;
}

export interface Product {
    productId: string;
    productName: string;
    productCode: string;
    description?: string;
    price: number;
    minOrderQuantity: number;
    category: Category;
    status: Status;
    currency: string;
    productImages: ProductImage[];
    productStock?: ProductStock;
    createdAt: string;
    updatedAt: string;
}

export interface ProductCreate {
    productName: string;
    productCode: string;
    description?: string;
    price: number;
    minOrderQuantity: number;
    categoryId: string;
    statusId: string;
    currency: string;
}

export interface ProductUpdate extends ProductCreate {
    productId: string;
} 