import { api } from '../lib/api';
import { ApiResponse, ICategory } from '../types/api';

export const CategoryService = {
  getAll: () => api.get<ApiResponse<ICategory[]>>('/categories'),
  getAllCategories: () => api.get<ApiResponse<ICategory[]>>('/categories'),
  getById: (id: string) => api.get<ApiResponse<ICategory>>(`/categories/${id}`),
  create: (formData: FormData) => api.post<ApiResponse<ICategory>>('/categories', formData),
  update: (id: string, formData: FormData) => api.patch<ApiResponse<ICategory>>(`/categories/${id}`, formData),
  delete: (id: string) => api.delete<ApiResponse<any>>(`/categories/${id}`),
};
