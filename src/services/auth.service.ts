import { api } from '../lib/api';

export const AuthService = {
  login: async (payload: any): Promise<any> => {
    return api.post<any>('/auth/login', payload);
  },

  signup: async (payload: any): Promise<any> => {
    return api.post<any>('/auth/signup', payload);
  },

  verifyAccount: async (payload: any): Promise<any> => {
    return api.post<any>('/auth/verify-account', payload);
  },

  resendOtp: async (payload: any): Promise<any> => {
    return api.post<any>('/auth/resend-otp', payload);
  },

  forgetPassword: async (email: string): Promise<any> => {
    return api.post<any>('/auth/forget-password', { email });
  },

  resetPassword: async (payload: any, token: string): Promise<any> => {
    return api.post<any>('/auth/reset-password', payload, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  refreshToken: async (refreshToken: string): Promise<any> => {
    return api.post<any>('/auth/refresh-token', { refreshToken });
  },

  getCurrentUser: async (): Promise<any> => {
    return api.get<any>('/users/my-profile');
  },
  
  changePassword: async (payload: any): Promise<any> => {
    return api.post<any>('/auth/change-password', payload);
  },

  deleteAccount: async (payload: { password?: string }): Promise<any> => {
    return api.delete<any>('/auth/delete-account', { data: payload });
  }
};
