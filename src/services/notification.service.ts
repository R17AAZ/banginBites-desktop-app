import { api } from '../lib/api';
import { ApiResponse, INotification } from '../types/api';

export const NotificationService = {
  getNotifications: (params?: Record<string, any>) => {
    const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return api.get<ApiResponse<INotification[]>>(`/notifications${query}`);
  },

  markAsRead: (id: string) =>
    api.get<ApiResponse<any>>(`/notifications/${id}`),

  markAllAsRead: () =>
    api.get<ApiResponse<any>>('/notifications/all'),

  registerToken: (fcmToken: string, deviceType: string = 'web') =>
    api.post<ApiResponse<any>>('/notifications/register-token', { fcmToken, deviceType }),
};
