import { api } from '../lib/api';
import { ApiResponse, IDish } from '../types/api';

export const FavoriteService = {
  toggleFavorite: (dishId: string) => 
    api.patch<ApiResponse<{ isFavorite: boolean }>>(`/favorites/toggle/${dishId}`, {}),

  getMyFavorites: () => 
    api.get<ApiResponse<IDish[]>>('/favorites/my-favorites'),
};
