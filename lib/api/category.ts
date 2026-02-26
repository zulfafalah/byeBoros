import { api } from "./client";

export interface CategoryItem {
    category_name: string;
    sub_category_name: string;
    budget: number;
}

export interface CategoryResponse {
    daily_budget: number;
    monthly_budget: number;
    categories: CategoryItem[];
}

/**
 * Fetch categories from the Master Data sheet.
 * Overrides X-Sheet-Name since categories live in "Master Data", not the monthly sheet.
 */
export async function getCategories(): Promise<CategoryResponse> {
    return api.get<CategoryResponse>("/api/category", {
        headers: { "X-Sheet-Name": "Master Data" },
    });
}

export interface IncomeCategoryResponse {
    categories: string[];
}

/**
 * Fetch income categories from the Master Data sheet.
 */
export async function getIncomeCategories(): Promise<IncomeCategoryResponse> {
    return api.get<IncomeCategoryResponse>("/api/category/income", {
        headers: { "X-Sheet-Name": "Master Data" },
    });
}
