import { api } from '../lib/api';
import { ApiResponse, IOrder, IOrderResponse, OrderStatus } from '../types/api';

export interface ICreateOrderPayload {
  sellerId: string;
  items: {
    dishId: string;
    quantity: number;
  }[];
  deliveryAddress: string;
  deliveryOption: 'DELIVERY' | 'COLLECTION';
  paymentMethod: 'ONLINE' | 'COD';
  platform?: 'MOBILE' | 'DESKTOP';
}

export const OrderService = {
  createOrder: (payload: ICreateOrderPayload) =>
    api.post<ApiResponse<IOrderResponse>>('/orders', payload),

  getMyOrders: (params?: Record<string, any>) => {
    const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return api.get<ApiResponse<IOrder[]>>(`/orders/my-orders${query}`);
  },

  getSingleOrder: (id: string) =>
    api.get<ApiResponse<IOrder>>(`/orders/${id}`),

  updateOrderStatus: (id: string, status: OrderStatus, deliveryOTP?: string) =>
    api.patch<ApiResponse<IOrder>>(`/orders/${id}/status`, { status, deliveryOTP }),
};
