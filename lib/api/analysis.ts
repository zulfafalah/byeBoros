import { api } from "./client";

/* ── Response types ──────────────────────────────── */

export interface AnalysisCategory {
    name: string;
    amount: number;
    percent: number;
}

export interface ExpenseChartCategory {
    category_name: string;
    sub_category_name: string;
    amount: number;
    percent: number;
}

interface AnalysisTopCategory {
    name: string;
    total: number;
    total_display: string;
}

interface AnalysisDailyAverage {
    label: string;
    amount: number;
    amount_display: string;
}

export interface PriorityItem {
    level: string;
    label: string;
    amount: number;
    amount_display: string;
}

export interface ExpenseAnalysisData {
    period: string;
    period_label: string;
    summary: {
        total_spent: number;
        total_spent_display: string;
    };
    chart: {
        categories: ExpenseChartCategory[];
    };
    top_category: AnalysisTopCategory;
    daily_average: AnalysisDailyAverage;
    priority_distribution: PriorityItem[] | null;
}

export interface IncomeAnalysisData {
    period: string;
    period_label: string;
    summary: {
        total_income: number;
        total_income_display: string;
    };
    chart: {
        categories: AnalysisCategory[];
    };
    top_category: AnalysisTopCategory;
    daily_average: AnalysisDailyAverage;
}

export interface AnalysisResponse {
    status: string;
    data: {
        expense: ExpenseAnalysisData;
        income: IncomeAnalysisData;
    };
}

export type AnalysisPeriod = "Day" | "Month" | "3 Months" | "6 Months" | "Year";

/**
 * Fetch analysis data (expense + income).
 * Spreadsheet ID and sheet name are automatically injected by the API client.
 * @param period - Optional time period filter (defaults to "Month" on the server)
 * @param date   - Optional specific date (YYYY-MM-DD). Used when period is "Day".
 */
export async function getAnalysis(period?: AnalysisPeriod, date?: string): Promise<AnalysisResponse> {
    const params = new URLSearchParams();
    if (period) params.set("period", period);
    if (date) params.set("date", date);
    const query = params.toString() ? `?${params.toString()}` : "";
    return api.get<AnalysisResponse>(`/api/analysis${query}`);
}
