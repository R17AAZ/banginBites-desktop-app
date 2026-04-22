import { api } from '../lib/api';
import { ApiResponse, ICategory, User } from '../types/api';

export interface IFaq {
  id: string;
  question: string;
  answer: string;
}

export interface IPublicContent {
  id: string;
  type: string;
  content: string;
}

export const PublicService = {
  getFeaturedKitchens: () =>
    api.get<ApiResponse<User[]>>('/public/featured-kitchens'),

  getAllKitchens: (filters: { searchTerm?: string; city?: string; categoryId?: string; page?: number; limit?: number } = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });
    return api.get<ApiResponse<User[]>>(`/public/kitchens?${params.toString()}`);
  },

  getFaqs: () =>
    api.get<ApiResponse<IFaq[]>>('/public/faq/all'),

  getPublicContent: (type: string) =>
    api.get<ApiResponse<IPublicContent>>(`/public/${type}`),

  getCategories: () =>
    api.get<ApiResponse<ICategory[]>>('/categories'),
};
