import { api } from '../lib/api';
import { ApiResponse, IDish } from '../types/api';

export interface DishFilters {
  searchTerm?: string;
  cuisine?: string;
  minPrice?: number;
  maxPrice?: number;
  sellerId?: string;
  categoryId?: string;
  isAvailable?: boolean;
  page?: number;
  limit?: number;
}

export const DishService = {
  getDishes: (filters: DishFilters = {}) => {
    const params = new URLSearchParams();
    const { page = 1, limit = 10, ...rest } = filters;
    
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    Object.entries(rest).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });

    return api.get<ApiResponse<IDish[]>>(`/dishes?${params.toString()}`);
  },

  getDish: (id: string) => 
    api.get<ApiResponse<IDish>>(`/dishes/${id}`),

  createDish: (formData: FormData) => 
    api.post<ApiResponse<IDish>>('/dishes', formData),

  updateDish: (id: string, formData: FormData) => 
    api.patch<ApiResponse<IDish>>(`/dishes/${id}`, formData),

  deleteDish: (id: string) => 
    api.delete<ApiResponse<any>>(`/dishes/${id}`),
};
