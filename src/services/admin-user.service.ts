import { api } from '../lib/api';
import { ApiResponse, User } from '../types/api';

export const AdminUserService = {
  getUsers: (params?: Record<string, any>) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return api.get<ApiResponse<User[]>>(`/users${query}`);
  },
  updateStatus: (id: string, status: string) => 
    api.patch<ApiResponse<any>>(`/users/${id}/status`, { status }),
};
