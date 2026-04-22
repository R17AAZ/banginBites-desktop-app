import { api } from '../lib/api';
import { ApiResponse, IReview } from '../types/api';

export interface ICreateReviewPayload {
  revieweeId: string;
  orderId: string;
  dishId?: string;
  rating: number;
  review: string;
}

export const ReviewService = {
  getReviews: (type: 'reviewer' | 'reviewee', params?: Record<string, any>) => {
    const query = params ? `&${new URLSearchParams(params as any).toString()}` : '';
    return api.get<ApiResponse<IReview[]>>(`/reviews/${type}?${query}`);
  },

  createReview: (payload: ICreateReviewPayload) =>
    api.post<ApiResponse<IReview>>('/reviews', payload),

  replyToReview: (id: string, reply: string) =>
    api.patch<ApiResponse<IReview>>(`/reviews/${id}/reply`, { reply }),

  hideReview: (id: string, isHidden: boolean) =>
    api.patch<ApiResponse<any>>(`/reviews/${id}/hide`, { isHidden }),

  deleteReview: (id: string) =>
    api.delete<ApiResponse<any>>(`/reviews/${id}`),

  getReviewsByTarget: (targetType: string, targetId: string) =>
    api.get<ApiResponse<IReview[]>>(`/reviews/target/${targetType}/${targetId}`),
};
