import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Rating } from '../../components/ui/Rating';
import { Button } from '../../components/ui/Button';
import { Star, MessageSquare, RefreshCcw, Send, EyeOff, Eye } from 'lucide-react';
import { ReviewService } from '../../services/review.service';
import { IReview } from '../../types/api';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import { ChefLoader } from '../../components/ui/LoadingSpinner';

const ManageReviews: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [reviews, setReviews] = useState<IReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [isReplying, setIsReplying] = useState<Record<string, boolean>>({});
  const [isHiding, setIsHiding] = useState<Record<string, boolean>>({});

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      // Admin fetches 'all', Sellers fetch 'reviewee'
      const fetchType = isAdmin ? ('all' as any) : 'reviewee';
      const res = await ReviewService.getReviews(fetchType);

      if (res.success) {
        const data = Array.isArray(res.data) ? res.data : (res.data as any)?.data;
        if (Array.isArray(data)) {
          setReviews(data);
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
  }, [isAdmin]);

  const handleReply = async (id: string) => {
    const text = replyText[id];
    if (!text?.trim()) return;

    try {
      setIsReplying(prev => ({ ...prev, [id]: true }));
      const res = await ReviewService.replyToReview(id, text);
      if (res.success) {
        setReviews(prev =>
          prev.map(r => r.id === id ? { ...r, reply: text, repliedAt: new Date().toISOString() } : r)
        );
        setReplyText(prev => {
          const newState = { ...prev };
          delete newState[id];
          return newState;
        });
        toast.success('Reply sent successfully');
      }
    } catch (error) {
      console.error('Failed to send reply', error);
      toast.error('Failed to send reply');
    } finally {
      setIsReplying(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleToggleHide = async (review: IReview) => {
    if (!isAdmin) return;

    try {
      setIsHiding(prev => ({ ...prev, [review.id]: true }));
      // The hide endpoint usually takes the NEW state or toggles. 
      // Backend says: const { isHidden } = req.body
      const newHiddenState = !review.isHidden;
      const res = await ReviewService.hideReview(review.id, newHiddenState);
      if (res.success) {
        setReviews(prev => prev.map(r => r.id === review.id ? { ...r, isHidden: newHiddenState } : r));
        toast.success(newHiddenState ? 'Review hidden' : 'Review visible');
      }
    } catch (error) {
      toast.error('Failed to update visibility');
    } finally {
      setIsHiding(prev => ({ ...prev, [review.id]: false }));
    }
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '0';

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <ChefLoader size={48} variant="flit" />
        <p className="text-neutral-500 font-medium animate-pulse">Loading feedback...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold font-heading text-neutral-900">
            {isAdmin ? 'Global Reviews Management' : 'Customer Feedback'}
          </h1>
          <p className="text-neutral-500 font-sans">
            {isAdmin ? 'Monitor and moderate all customer reviews across the platform.' : 'See what customers are saying about your dishes.'}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={fetchReviews} className="text-neutral-500">
          <RefreshCcw size={16} className={isLoading ? 'animate-spin' : ''} />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1 border border-brand/20 bg-brand/5 p-6 h-fit sticky top-6 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-brand/70 mb-2">
            {isAdmin ? 'Platform Average' : 'Your Kitchen Rating'}
          </p>
          <div className="flex items-end gap-2">
            <h3 className="text-4xl font-black font-heading tracking-tighter text-neutral-900">{averageRating}</h3>
            <div className="flex items-center gap-0.5 mb-1.5">
              <Rating rating={Number(averageRating)} size="sm" />
            </div>
          </div>
          <p className="text-[10px] font-bold mt-4 text-neutral-400 uppercase tracking-tight">Based on {reviews.length} customer reviews</p>
        </Card>

        <div className="md:col-span-3 space-y-4">
          {reviews.length === 0 ? (
            <Card className="border-dashed border-2 border-neutral-200 bg-neutral-50 p-12 text-center">
              <MessageSquare size={32} className="mx-auto text-neutral-300 mb-4" />
              <p className="text-neutral-500">No reviews found.</p>
            </Card>
          ) : (
            reviews.map((rev) => (
              <Card key={rev.id} className={cn(
                "border-neutral-100 p-5 transition-all",
                rev.isHidden && "opacity-60 bg-neutral-50 grayscale-[0.5]"
              )}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-xs font-bold text-brand uppercase">
                      {rev.reviewer?.name?.substring(0, 2) || 'AN'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="font-bold text-neutral-900 text-sm">{rev.reviewer?.name || 'Anonymous'}</h5>
                        {rev.isHidden && (
                          <span className="px-1.5 py-0.5 bg-neutral-200 text-neutral-600 text-[10px] font-bold rounded uppercase tracking-wider flex items-center gap-1">
                            <EyeOff size={10} /> Hidden
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-neutral-400 uppercase font-bold">
                        {formatDistanceToNow(new Date(rev.createdAt), { addSuffix: true })} • {rev.dish?.name || 'Dish'}
                        {isAdmin && <span className="text-brand"> • Kitchen: {rev.reviewee?.name}</span>}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-0.5">
                      <Rating rating={rev.rating} size="sm" />
                    </div>
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "h-7 px-2 text-[10px] font-bold uppercase tracking-wider gap-1",
                          rev.isHidden ? "text-emerald-600 hover:bg-emerald-50" : "text-rose-600 hover:bg-rose-50"
                        )}
                        onClick={async () => {
                          try {
                            const res = await ReviewService.hideReview(rev.id, !rev.isHidden);
                            if (res.success) {
                              setReviews(prev => prev.map(r => r.id === rev.id ? { ...r, isHidden: !rev.isHidden } : r));
                              toast.success(rev.isHidden ? 'Review visible' : 'Review hidden');
                            }
                          } catch (error) {
                            toast.error('Failed to update visibility');
                          }
                        }}
                      >
                        {rev.isHidden ? <Eye size={12} /> : <EyeOff size={12} />}
                        {rev.isHidden ? 'Unhide' : 'Hide'}
                      </Button>
                    )}
                  </div>
                </div>

                <p className="text-neutral-700 text-sm mb-4 leading-relaxed font-sans">
                  {rev.review}
                </p>

                {rev.reply ? (
                  <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100 flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                      <MessageSquare size={16} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-neutral-400 uppercase mb-1">
                        {rev.repliedAt ? `${isAdmin && rev.reply ? 'Reply' : 'Your Reply'} • ${formatDistanceToNow(new Date(rev.repliedAt), { addSuffix: true })}` : 'Reply'}
                      </p>
                      <p className="text-sm text-neutral-600 italic leading-relaxed">"{rev.reply}"</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="relative">
                      <textarea
                        value={replyText[rev.id] || ''}
                        onChange={(e) => setReplyText(prev => ({ ...prev, [rev.id]: e.target.value }))}
                        placeholder="Write a reply..."
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all resize-none min-h-[80px]"
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        onClick={() => handleReply(rev.id)}
                        disabled={!replyText[rev.id]?.trim() || isReplying[rev.id]}
                        className="font-bold"
                      >
                        {isReplying[rev.id] ? (
                          <RefreshCcw size={14} className="mr-2 animate-spin" />
                        ) : (
                          <Send size={14} className="mr-2" />
                        )}
                        Reply
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageReviews;
