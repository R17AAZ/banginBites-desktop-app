export type Role = 'ADMIN' | 'SELLER' | 'BUYER' | 'USER' | 'CUSTOMER' | 'GUEST';

export interface User {

  id: string;
  name: string;
  email: string;
  role: Role;
  profile?: string;
  phone?: string;
  verified: boolean;
  status: 'ACTIVE' | 'RESTRICTED' | 'DELETED';
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  metrics?: IUserMetrics;
  categories?: ICategory[];
  isVerified: any;
  createdAt: number;
}

export interface IUserMetrics {
  id: string;
  userId: string;
  rating: number;
  totalReview: number;
  createdAt: string;
  updatedAt: string;
}

export interface IAuthResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    role: Role;
    token?: string; // Reset token
  };
}

export interface IVerifyAccountPayload {
  email: string;
  type: 'ACCOUNT_ACTIVATION' | 'RESET_PASSWORD';
  oneTimeCode: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export interface ICategory {
  id: string;
  name: string;
  description?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IDish {
  id: string;
  sellerId: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  images?: string[];
  hygieneInfo?: string;
  preparationTime?: number;
  ingredients?: string[];
  isFreeDelivery: boolean;
  isAvailable: boolean;
  rating: number;
  totalReview: number;
  isFavorite?: boolean;
  createdAt: string;
  updatedAt: string;
  reviews?: IReview[];
  seller?: User;
  category?: ICategory;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
export type PaymentMethod = 'ONLINE' | 'COD';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface IOrderItem {
  id: string;
  orderId: string;
  dishId: string;
  quantity: number;
  price: number;
  dish?: IDish;
}

export interface IOrder {
  id: string;
  buyerId: string;
  sellerId: string;
  totalAmount: number;
  platformFee: number;
  sellerAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  deliveryAddress?: string;
  deliveryOTP?: string;
  deliveryOption: 'DELIVERY' | 'COLLECTION';
  createdAt: string;
  updatedAt: string;
  items?: IOrderItem[];
  buyer?: User;
  seller?: User;
  reviews?: IReview[];
}

export interface IPagination {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface IOrderResponse {
  order: IOrder;
  checkoutUrl?: string;
}

export type NotificationType =
  | 'REVIEW_RECEIVED'
  | 'REVIEW_REPLIED'
  | 'SYSTEM_ALERT'
  | 'LOGIN_DETECTED'
  | 'ORDER_PLACED'
  | 'ORDER_STATUS_UPDATED';

export interface INotification {
  id: string;
  fromId?: string;
  toId: string;
  title?: string;
  body?: string;
  type: NotificationType;
  metadata?: any;
  isAdmin?: boolean;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  from?: User;
  to?: User;
}

export interface IReview {
  id: string;
  reviewerId: string;
  revieweeId: string;
  orderId: string;
  dishId?: string;
  rating: number;
  review: string;
  reply?: string;
  repliedAt?: string;
  isHidden: boolean;
  createdAt: string;
  updatedAt: string;
  reviewee?: User;
  reviewer?: User;
  dish?: IDish;
}

