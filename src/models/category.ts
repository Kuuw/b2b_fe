export interface Category {
    categoryId: string;
    categoryName: string;
    description?: string;
    parentCategoryId?: string;
    statusId: string;
    status: {
        statusId: string;
        statusName: string;
    };
} 