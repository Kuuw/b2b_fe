import { Status } from './common';

export interface Category {
    categoryId: string;
    categoryName: string;
    categoryDescription?: string;
}

export interface ProductImage {
    productImageId: string;
    productId: string;
    imageUrl: string;
}

export interface ProductStock {
    productStockId: string;
    productId: string;
    quantity: number;
}

export interface Product {
    productId: string;
    productName: string;
    productCode: string;
    description?: string;
    price: number;
    currency: string;
    minOrderQuantity: number;
    category: Category;
    productImages: ProductImage[];
    productStock?: ProductStock;
    status: Status;
}

export interface ProductCreate {
    productName: string;
    productCode: string;
    description?: string;
    categoryId: string;
    price: number;
    currency: string;
    statusId: string;
    minOrderQuantity: number;
}

export interface ProductUpdate extends ProductCreate {
    productId: string;
} 