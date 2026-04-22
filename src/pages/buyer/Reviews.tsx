import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Rating } from '../../components/ui/Rating';
import { Button } from '../../components/ui/Button';
import { Trash2, RefreshCcw, MessageSquare } from 'lucide-react';
import { ReviewService } from '../../services/review.service';
import { IReview } from '../../types/api';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { ChefLoader } from '../../components/ui/LoadingSpinner';

const BuyerReviews: React.FC = () => {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const res = await ReviewService.getReviews('reviewer');
      if (res.success) {
        // More robust data extraction
        const responseData = res.data;
        const actualData = Array.isArray(responseData)
          ? responseData
          : (responseData as any)?.data;

        if (Array.isArray(actualData)) {
          setReviews(actualData);
        } else {
          setReviews([]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch reviews', error);
      toast.error('Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      const res = await ReviewService.deleteReview(id);
      if (res.success) {
        setReviews(prev => prev.filter(r => r.id !== id));
        toast.success('Review deleted successfully');
      }
    } catch (error) {
      console.error('Failed to delete review', error);
      toast.error('Failed to delete review');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <ChefLoader size={48} variant="flit" />
        <p className="text-neutral-500 font-medium font-sans animate-pulse">Gathering feedback...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold font-heading text-neutral-900">My Reviews</h1>
          <p className="text-neutral-500 font-sans">Your contribution to the community feedback.</p>
        </div>
        <Button variant="ghost" size="sm" onClick={fetchReviews} className="text-neutral-500">
          <RefreshCcw size={16} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {reviews.length === 0 ? (
        <Card className="border-dashed border-2 border-neutral-200 bg-neutral-50">
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-400 mb-4">
              <MessageSquare size={32} />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 mb-1">No reviews yet</h3>
            <p className="text-neutral-500 max-w-xs">You haven't reviewed any dishes yet. Your feedback helps others!</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev) => (
            <Card key={rev.id} className="border-neutral-100 overflow-hidden p-0 flex flex-col h-full">
              <div className="p-5 flex items-start gap-4 flex-1">
                <div className="w-16 h-16 rounded-xl bg-neutral-100 shrink-0 flex items-center justify-center overflow-hidden">
                  {rev.dish?.images?.[0] ? (
                    <img src={rev.dish.images[0]} alt={rev.dish.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl">🍲</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <h4 className="font-bold text-neutral-900 truncate">{rev.dish?.name || 'Deleted Dish'}</h4>
                      {rev.dish?.category && (
                        <span className="text-[10px] font-bold text-brand uppercase tracking-wider block">
                          {rev.dish.category.name}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-neutral-400 font-medium uppercase shrink-0">
                      {rev.createdAt ? formatDistanceToNow(new Date(rev.createdAt), { addSuffix: true }) : 'Just now'}
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5 mb-3">
                    <Rating rating={rev.rating} size="sm" />
                  </div>
                  <p className="text-sm text-neutral-600 font-sans leading-relaxed mb-4">{rev.review}</p>

                  {rev.reply && (
                    <div className="bg-brand/5 p-3 rounded-lg border-l-2 border-brand relative mt-auto">
                      <p className="text-xs font-bold text-brand uppercase mb-1">Seller Reply</p>
                      <p className="text-xs text-neutral-700 italic">"{rev.reply}"</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="px-5 py-3 bg-neutral-50 flex justify-end gap-2 border-t border-neutral-100 mt-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(rev.id)}
                  className="text-red-500 hover:bg-red-50"
                >
                  <Trash2 size={14} className="mr-1" /> Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BuyerReviews;
