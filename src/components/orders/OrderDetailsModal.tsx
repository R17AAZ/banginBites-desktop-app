import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { IOrder, OrderStatus, PaymentStatus, IDish } from '../../types/api';
import { 
  Package, 
  MapPin, 
  User, 
  CreditCard, 
  Clock, 
  Calendar,
  MessageSquare,
  CheckCircle,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';
import ReviewModal from '../Review/ReviewModal';
import { ReviewService } from '../../services/review.service';
import toast from 'react-hot-toast';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: IOrder | null;
  onReviewSubmitted?: () => void;
}

const StatusBadge: React.FC<{ status: OrderStatus | PaymentStatus }> = ({ status }) => {
  const getStyles = () => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'CONFIRMED':
      case 'PAID':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'PREPARING':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'OUT_FOR_DELIVERY':
        return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'DELIVERED':
        return 'bg-neutral-50 text-neutral-600 border-neutral-100';
      case 'CANCELLED':
      case 'FAILED':
        return 'bg-rose-50 text-rose-600 border-rose-100';
      default:
        return 'bg-neutral-50 text-neutral-500 border-neutral-100';
    }
  };

  return (
    <span className={cn(
      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
      getStyles()
    )}>
      {status.replace(/_/g, ' ')}
    </span>
  );
};

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  isOpen,
  onClose,
  order,
  onReviewSubmitted
}) => {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState<IDish | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!order) return null;

  const handleOpenReview = (dish: IDish) => {
    setSelectedDish(dish);
    setIsReviewModalOpen(true);
  };

  const handleReviewSubmit = async (data: { rating: number; comment: string }) => {
    if (!selectedDish || !order) return;

    try {
      setIsSubmitting(true);
      const res = await ReviewService.createReview({
        revieweeId: order.sellerId,
        orderId: order.id,
        dishId: selectedDish.id,
        rating: data.rating,
        review: data.comment,
      });

      if (res.success) {
        toast.success('Your review has been submitted!');
        if (onReviewSubmitted) {
          onReviewSubmitted();
        }
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to submit review';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
      setIsReviewModalOpen(false);
      setSelectedDish(null);
    }
  };

  const isDishReviewed = (dishId: string) => {
    return order.reviews?.some(review => review.dishId === dishId);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`Order Details`}
        maxW="max-w-2xl"
      >
        <div className="space-y-8">
          {/* Header/Summary */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
            <div>
              <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest mb-1">Order ID</p>
              <p className="font-mono text-sm text-neutral-900 font-bold">#{order.id}</p>
            </div>
            <div className="flex gap-2">
              <StatusBadge status={order.status} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
            {/* Left Column: Customer & Delivery */}
            <div className="space-y-6">
              <section className="space-y-4">
                <h3 className="flex items-center gap-2 font-bold text-neutral-900 uppercase tracking-wider text-xs">
                  <User size={14} className="text-brand" />
                  Customer Info
                </h3>
                <div className="space-y-1">
                  <p className="font-bold text-neutral-900">{order.buyer?.name}</p>
                  <p className="text-neutral-500">{order.buyer?.email}</p>
                  {order.buyer?.phone && <p className="text-neutral-500">{order.buyer.phone}</p>}
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="flex items-center gap-2 font-bold text-neutral-900 uppercase tracking-wider text-xs">
                  <MapPin size={14} className="text-brand" />
                  Delivery Details
                </h3>
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-white border border-neutral-100">
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Option</p>
                    <p className="font-bold text-neutral-900 capitalize">{order.deliveryOption.toLowerCase()}</p>
                  </div>
                  {order.deliveryAddress && (
                    <div className="p-3 rounded-xl bg-white border border-neutral-100">
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Address</p>
                      <p className="text-neutral-900 leading-relaxed">{order.deliveryAddress}</p>
                    </div>
                  )}
                  {order.deliveryOTP && order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                    <div className="p-4 rounded-xl bg-brand/5 border border-brand/20 flex flex-col items-center justify-center text-center">
                      <p className="text-[10px] font-bold text-brand uppercase tracking-widest mb-2">Delivery Verification Code</p>
                      <p className="text-3xl font-bold text-brand tracking-[0.5em] ml-[0.5em]">{order.deliveryOTP}</p>
                      <p className="text-[10px] text-neutral-500 mt-2 italic px-4">Provide this code to the seller upon delivery to verify receipt.</p>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Right Column: Order Items */}
            <div className="space-y-6">
              <section className="space-y-4">
                <h3 className="flex items-center gap-2 font-bold text-neutral-900 uppercase tracking-wider text-xs">
                  <Package size={14} className="text-brand" />
                  Items ordered
                </h3>
                <div className="space-y-3">
                  {order.items?.map((item) => {
                    const reviewed = isDishReviewed(item.dishId);
                    return (
                      <div key={item.id} className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-100 shrink-0">
                            <img 
                              src={item.dish?.images?.[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'} 
                              className="w-full h-full object-cover" 
                              alt={item.dish?.name} 
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-neutral-900 truncate">{item.dish?.name}</p>
                            <p className="text-xs text-neutral-500">{item.quantity} x £{item.price.toFixed(2)}</p>
                          </div>
                          <p className="font-bold text-neutral-900 text-right">£{(item.quantity * item.price).toFixed(2)}</p>
                        </div>
                        {order.status === 'DELIVERED' && item.dish && (
                          <div className="pl-15 flex justify-end">
                            {reviewed ? (
                              <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2 py-1 rounded-lg">
                                <CheckCircle size={10} /> Reviewed
                              </span>
                            ) : (
                              <Button 
                                size="sm" 
                                onClick={() => handleOpenReview(item.dish!)}
                                className="h-8 px-4 text-[10px] font-bold uppercase tracking-wider gap-2 bg-brand text-white hover:bg-brand/90 transition-all shadow-sm"
                              >
                                <MessageSquare size={12} /> Review Dish
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-neutral-100 space-y-2">
                  <div className="flex justify-between text-neutral-500">
                    <span>Subtotal</span>
                    <span>£{order.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg text-neutral-900 pt-2 border-t border-dashed border-neutral-100">
                    <span>Total</span>
                    <span className="text-brand">£{order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="flex items-center gap-2 font-bold text-neutral-900 uppercase tracking-wider text-xs">
                  <CreditCard size={14} className="text-brand" />
                  Payment Method
                </h3>
                <div className="flex items-center gap-2 font-bold text-neutral-900">
                  <div className="p-2 rounded-lg bg-white border border-neutral-100">
                    {order.paymentMethod === 'ONLINE' ? 'Stripe Online' : 'Cash on Delivery'}
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-neutral-100">
            <div className="flex items-center gap-2 text-neutral-500">
              <Clock size={14} />
              <span className="text-xs">{new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-500">
              <Calendar size={14} />
              <span className="text-xs">{new Date(order.createdAt).toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </Modal>

      {selectedDish && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => {
            if (!isSubmitting) {
              setIsReviewModalOpen(false);
              setSelectedDish(null);
            }
          }}
          targetName={selectedDish.name}
          targetImage={selectedDish.images?.[0]}
          onSubmit={handleReviewSubmit}
        />
      )}
    </>
  );
};
