import { api } from '../lib/api';
import { ApiResponse, User } from '../types/api';

export const UserService = {
  getProfile: () => 
    api.get<ApiResponse<User>>('/users/my-profile'),

  updateProfile: (formData: FormData) => 
    api.patch<ApiResponse<User>>('/users/profile', formData),

  getSellerProfile: (id: string) => 
    api.get<ApiResponse<User>>(`/users/seller/${id}`),
};
