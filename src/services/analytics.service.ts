import { api } from '../lib/api';
import { ApiResponse } from '../types/api';

export interface SellerStats {
  earnings: {
    total: number;
    today: number;
    totalOrders: number;
    todayOrders: number;
  };
  ordersByStatus: Record<string, number>;
  topDishes: Array<{
    dishId: string;
    name: string;
    totalSold: number;
  }>;
  metrics: {
    rating: number;
    totalReviews: number;
  };
}

export interface DetailedAnalytics {
  monthlyRevenue: Array<{ month: string; amount: number; orders: number }>;
  categorySales: Array<{ category: string; amount: number; quantity: number }>;
  topDishes: Array<{ name: string; amount: number; quantity: number }>;
  summary: {
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
  };
}

export interface AdminRevenue {
  revenueTrend: Array<{ month: string; gmv: number; fees: number; orders: number }>;
  summary: {
    totalGMV: number;
    totalFees: number;
    totalOrders: number;
  };
}

export const AnalyticsService = {
  getSellerStats: () => 
    api.get<ApiResponse<SellerStats>>('/analytics/seller'),
    
  getAdminStats: () => 
    api.get<ApiResponse<any>>('/analytics/admin'),

  getDetailedSellerAnalytics: (year: number, month?: number) => {
    const query = new URLSearchParams({ year: year.toString() });
    if (month !== undefined) query.append('month', month.toString());
    return api.get<ApiResponse<DetailedAnalytics>>(`/analytics/seller-detailed?${query.toString()}`);
  },

  getAdminDetailedAnalytics: (year: number) => {
    const query = new URLSearchParams({ year: year.toString() });
    return api.get<ApiResponse<AdminRevenue>>(`/analytics/admin-detailed?${query.toString()}`);
  },
};
