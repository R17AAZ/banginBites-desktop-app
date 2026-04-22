import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
  ShoppingBag,
  Clock,
  Package,
  RefreshCcw,
  CheckCircle2,
  History,
  Info,
  AlertCircle,
  ChevronRight,
  MessageSquare,
  CheckCircle
} from 'lucide-react';
import { OrderService } from '../../services/order.service';
import { IOrder, OrderStatus, IDish } from '../../types/api';
import toast from 'react-hot-toast';
import { OrderDetailsModal } from '../../components/orders/OrderDetailsModal';
import { formatDistanceToNow } from 'date-fns';
import { OrderProgressTracker } from '../../components/orders/OrderProgressTracker';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addItem, toggleCart } from '../../store/slices/cartSlice';
import ReviewModal from '../../components/Review/ReviewModal';
import { ReviewService } from '../../services/review.service';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';
import { ChefLoader } from '../../components/ui/LoadingSpinner';

const BuyerOrders: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isOpen: isCartOpen } = useAppSelector((state) => state.cart);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  // Review states  
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedDishForReview, setSelectedDishForReview] = useState<IDish | null>(null);
  const [currentOrderForReview, setCurrentOrderForReview] = useState<IOrder | null>(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const handleReorder = (order: IOrder) => {
    if (!order.items || order.items.length === 0) {
      toast.error('No items found in this order');
      return;
    }

    order.items.forEach(item => {
      if (item.dish) {
        dispatch(addItem({
          id: item.dish.id,
          name: item.dish.name,
          price: item.price,
          image: item.dish.images?.[0] || '',
          kitchenName: order.seller?.name
        }));
      }
    });

    toast.success('Items added to cart');

    // Open cart if not already open
    if (!isCartOpen) {
      dispatch(toggleCart());
    }
  };

  const hasPendingReviews = (order: IOrder) => {
    if (order.status !== 'DELIVERED') return false;
    if (!order.items) return false;
    const reviewedDishIds = order.reviews?.map(r => r.dishId) || [];
    return order.items.some(item => !reviewedDishIds.includes(item.dishId));
  };

  const fetchOrders = async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);
      const res = await OrderService.getMyOrders();
      if (res.success) {
        setOrders(res.data);
        // If an order is currently selected in the details modal, update it with fresh data
        if (selectedOrder) {
          const updatedOrder = res.data.find((o: IOrder) => o.id === selectedOrder.id);
          if (updatedOrder) {
            setSelectedOrder(updatedOrder);
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch orders', error);
      toast.error('Failed to load orders');
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Real-time listener
    const handleSocketUpdate = () => {
      fetchOrders(false);
    };

    window.addEventListener('socket_notification', handleSocketUpdate);

    // Refresh for active orders as fallback
    const interval = setInterval(() => fetchOrders(false), 120000); // Increased interval as fallback

    return () => {
      window.removeEventListener('socket_notification', handleSocketUpdate);
      clearInterval(interval);
    };
  }, []);

  const handleViewDetails = (order: IOrder) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleOpenExternalReview = (dish: IDish, order: IOrder) => {
    setSelectedDishForReview(dish);
    setCurrentOrderForReview(order);
    setIsReviewModalOpen(true);
  };

  const handleReviewSubmit = async (data: { rating: number; comment: string }) => {
    if (!selectedDishForReview || !currentOrderForReview) return;

    try {
      setIsSubmittingReview(true);
      const res = await ReviewService.createReview({
        revieweeId: currentOrderForReview.sellerId,
        orderId: currentOrderForReview.id,
        dishId: selectedDishForReview.id,
        rating: data.rating,
        review: data.comment,
      });

      if (res.success) {
        toast.success(`Review for ${selectedDishForReview.name} submitted!`);
        fetchOrders(false);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to submit review';
      toast.error(errorMessage);
    } finally {
      setIsSubmittingReview(false);
      setIsReviewModalOpen(false);
      setSelectedDishForReview(null);
      setCurrentOrderForReview(null);
    }
  };

  const handleReviewClick = (order: IOrder) => {
    // Find first dish that isn't reviewed
    const unreviewedDish = order.items?.find(item => !order.reviews?.some(r => r.dishId === item.dishId))?.dish;
    if (unreviewedDish) {
      handleOpenExternalReview(unreviewedDish, order);
    } else {
      handleViewDetails(order);
    }
  };

  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING': return { color: 'bg-yellow-100 text-yellow-700', icon: <Clock size={12} />, label: 'Pending' };
      case 'CONFIRMED': return { color: 'bg-blue-100 text-blue-700', icon: <CheckCircle2 size={12} />, label: 'Confirmed' };
      case 'PREPARING': return { color: 'bg-orange-100 text-orange-700', icon: <Package size={12} />, label: 'Preparing' };
      case 'OUT_FOR_DELIVERY': return { color: 'bg-indigo-100 text-indigo-700', icon: <Package size={12} />, label: 'Out for Delivery' };
      case 'DELIVERED': return { color: 'bg-green-100 text-green-700', icon: <CheckCircle2 size={12} />, label: 'Delivered' };
      case 'CANCELLED': return { color: 'bg-red-100 text-red-700', icon: <AlertCircle size={12} />, label: 'Cancelled' };
      default: return { color: 'bg-neutral-100 text-neutral-600', icon: null, label: status };
    }
  };

  const activeStatuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY'] as OrderStatus[];
  const activeOrders = orders.filter(order => activeStatuses.includes(order.status));
  const pastOrders = orders.filter(order => !activeStatuses.includes(order.status));

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <ChefLoader size={48} variant="flit" />
        <p className="text-neutral-500 font-medium animate-pulse">Fetching your orders...</p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto space-y-10 py-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold font-heading text-neutral-900 tracking-tight">Your Orders</h1>
          <p className="text-neutral-500 font-sans mt-2 text-lg">Track your active orders and view your dining history.</p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => fetchOrders()}>
          <RefreshCcw size={16} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Active Orders Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
          <h2 className="text-2xl font-bold font-heading text-neutral-900 flex items-center gap-3">
            <div className="p-2 bg-brand/10 rounded-xl">
              <Clock size={20} className="text-brand" />
            </div>
            Active Orders
            {activeOrders.length > 0 && (
              <span className="ml-2 px-2.5 py-0.5 bg-brand/10 text-brand text-xs font-bold rounded-full">
                {activeOrders.length}
              </span>
            )}
          </h2>
        </div>

        {activeOrders.length > 0 ? (
          <div className="grid grid-cols-1 gap-8">
            {activeOrders.map((order) => {
              const statusCfg = getStatusConfig(order.status);
              return (
                <Card key={order.id} className="border-neutral-100 hover:border-brand/30 transition-all duration-500 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-brand/5 group bg-white">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row h-full">
                      <div className="sm:w-80 aspect-square sm:aspect-auto overflow-hidden relative shrink-0">
                        <img
                          src={order.items?.[0]?.dish?.images?.[0] || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500'}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          alt={order.seller?.name}
                        />
                        <div className="absolute top-4 left-4">
                          <span className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl backdrop-blur-md border border-white/20",
                            statusCfg.color
                          )}>
                            {statusCfg.icon}
                            {statusCfg.label}
                          </span>
                        </div>
                      </div>

                      <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between">
                        <div className="space-y-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <h3 className="text-2xl font-black font-heading tracking-tight text-neutral-900 group-hover:text-brand transition-colors">
                                {order.seller?.name || 'Local Kitchen'}
                              </h3>
                              <p className="text-sm text-neutral-500 font-medium mt-1.5 line-clamp-1">
                                {order.items?.map(item => `${item.quantity}x ${item.dish?.name}`).join(', ')}
                              </p>
                            </div>
                            <span className="text-[10px] font-mono text-neutral-300 font-black shrink-0 bg-neutral-50 px-2 py-1 rounded-md">
                              #{order.id.slice(-6).toUpperCase()}
                            </span>
                          </div>

                          <div className="flex items-center gap-8 border-y border-neutral-50 py-4">
                            <div>
                              <p className="text-[10px] uppercase text-neutral-400 font-black tracking-widest mb-1.5">Placed</p>
                              <div className="flex items-center gap-2 text-neutral-900">
                                <Clock size={14} className="text-brand" />
                                <p className="text-sm font-bold">{formatDistanceToNow(new Date(order.createdAt))} ago</p>
                              </div>
                            </div>
                            <div className="w-px h-8 bg-neutral-100" />
                            <div>
                              <p className="text-[10px] uppercase text-neutral-400 font-black tracking-widest mb-1.5">Amount</p>
                              <p className="text-sm font-black text-brand text-lg">£{order.totalAmount.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>

                        <div className="w-full mt-8 mb-6 space-y-4">
                          {order.deliveryOTP && order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                            <div className="p-4 rounded-2xl bg-brand/5 border border-brand/20 flex flex-col items-center justify-center text-center shadow-sm">
                              <p className="text-[10px] font-black text-brand uppercase tracking-[0.2em] mb-2">Delivery OTP</p>
                              <p className="text-3xl font-black text-brand tracking-[0.5em] ml-[0.5em]">{order.deliveryOTP}</p>
                              <p className="text-[10px] text-neutral-400 mt-2 font-medium">Show this to the seller to verify your delivery</p>
                            </div>
                          )}
                          <div className="px-2 py-6 bg-neutral-50/50 rounded-3xl border border-neutral-100/50">
                            <OrderProgressTracker status={order.status} />
                          </div>
                        </div>

                        <div className="flex gap-3 mt-auto">
                          <Button
                            variant="secondary"
                            className="w-full"
                            onClick={() => handleViewDetails(order)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-16 text-center border-dashed border-2 bg-neutral-50/50 border-neutral-200">
            <div className="flex flex-col items-center max-w-sm mx-auto space-y-4">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm text-neutral-200">
                <ShoppingBag size={40} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-neutral-900">No active orders</h3>
                <p className="text-neutral-500 mt-2">Hungry? Discover amazing homemade meals from local kitchens near you.</p>
              </div>
              <Button variant="primary" onClick={() => navigate('/buyer/dashboard')} className="mt-2 group">
                Browse Kitchens
                <ChevronRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </Card>
        )}
      </section>

      {/* Past Orders Section */}
      <section className="space-y-6 pt-10 border-t border-neutral-100">
        <h2 className="text-2xl font-bold font-heading text-neutral-900 flex items-center gap-3">
          <div className="p-2 bg-neutral-100 rounded-xl text-neutral-500">
            <History size={20} />
          </div>
          Order History
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {pastOrders.length > 0 ? (
            pastOrders.map((order) => {
              const statusCfg = getStatusConfig(order.status);
              return (
                <Card key={order.id} className="hover:border-neutral-300 transition-all border-neutral-100 p-0 overflow-hidden group shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center p-5 gap-6">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 ring-1 ring-neutral-100 shadow-sm">
                      <img
                        src={order.items?.[0]?.dish?.images?.[0] || 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500'}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        alt={order.seller?.name}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <h4 className="font-bold text-neutral-900 truncate text-lg">{order.seller?.name || 'Local Kitchen'}</h4>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${statusCfg.color} bg-opacity-70 backdrop-blur-sm`}>
                          {statusCfg.icon} {statusCfg.label}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-500 font-medium truncate mb-2 max-w-md">
                        {order.items?.map(item => `${item.quantity}x ${item.dish?.name}`).join(', ')}
                      </p>

                      {/* External Review Quick Actions */}
                      {order.status === 'DELIVERED' && order.items && order.items.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {order.items.map(item => {
                            const isReviewed = order.reviews?.some(r => r.dishId === item.dishId);
                            if (!item.dish) return null;

                            if (isReviewed) {
                              return (
                                <div key={item.id} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-100/50">
                                  <CheckCircle size={10} /> {item.dish.name}
                                </div>
                              );
                            }

                            return (
                              <button
                                key={item.id}
                                onClick={() => handleOpenExternalReview(item.dish!, order)}
                                className="flex items-center gap-2 p-1 pr-2.5 rounded-lg bg-brand/5 hover:bg-brand/10 text-brand transition-all border border-brand/10 group shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
                              >
                                <img
                                  src={item.dish?.images?.[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'}
                                  className="w-5 h-5 rounded object-cover shadow-xs mr-0.5"
                                  alt={item.dish.name}
                                />
                                <span className="text-[10px] font-bold">{item.dish.name}</span>
                                <MessageSquare size={10} className="ml-1 opacity-70 group-hover:opacity-100" />
                              </button>
                            );
                          })}
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-xs font-bold font-sans text-neutral-400 mt-3">
                        <span className="flex items-center gap-1.5"><Clock size={12} /> {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <div className="w-1 h-1 bg-neutral-200 rounded-full" />
                        <span className="text-neutral-900">£{order.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">

                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleViewDetails(order)}
                      >
                        <Info size={16} className="mr-2" /> Details
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleReorder(order)}
                      >
                        Reorder
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })
          ) : (
            <div className="py-20 text-center text-neutral-400 font-medium">
              Your order history is empty.
            </div>
          )}
        </div>
      </section>

      <OrderDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
        onReviewSubmitted={() => fetchOrders(false)}
      />

      {selectedDishForReview && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => {
            if (!isSubmittingReview) {
              setIsReviewModalOpen(false);
              setSelectedDishForReview(null);
              setCurrentOrderForReview(null);
            }
          }}
          targetName={selectedDishForReview.name}
          targetImage={selectedDishForReview.images?.[0]}
          onSubmit={handleReviewSubmit}
        />
      )}
    </div>
  );
};

export default BuyerOrders;
