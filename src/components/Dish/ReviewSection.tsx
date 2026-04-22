import React from 'react';
import { MessageSquare, ThumbsUp } from 'lucide-react';
import { Rating } from '../ui/Rating';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';


interface Review {
    id: string;
    user: string;
    rating: number;
    comment: string;
    date: string;
    avatar: string;
    verified: boolean;
}

interface ReviewsSectionProps {
    rating: number;
    totalReviews: number;
    reviews: Review[];
    onWriteReview?: () => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
    rating,
    totalReviews,
    reviews,
    onWriteReview
}) => {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h2 className="text-2xl font-bold font-heading">Customer Reviews</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <Rating
                            rating={rating}
                            totalReviews={totalReviews}
                            showCount={true}
                            size="md"
                            variant="brand"
                        />
                    </div>
                </div>
                {onWriteReview && (
                    <Button
                        onClick={onWriteReview}
                        size="sm"
                        className="bg-brand hover:bg-brand/90 rounded-xl text-sm px-6"
                    >
                        <MessageSquare size={14} className="mr-2" />
                        Write Review
                    </Button>
                )}
            </div>

            {/* Reviews List */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {reviews.map((review) => (
                    <Card key={review.id} className="bg-white border-neutral-100 rounded-xl hover:shadow-sm transition-shadow">
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand/20 to-brand/10 flex items-center justify-center font-bold text-brand text-xs">
                                        {review.avatar}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-1.5">
                                            <p className="font-semibold text-sm text-neutral-900">{review.user}</p>
                                            {review.verified && (
                                                <span className="text-[9px] bg-green-100 text-green-600 px-1.5 py-0.5 rounded-full">Verified</span>
                                            )}
                                        </div>
                                        <p className="text-[10px] text-neutral-400">{review.date}</p>
                                    </div>
                                </div>
                                <Rating rating={review.rating} size="sm" />
                            </div>
                            <p className="text-neutral-600 text-sm leading-relaxed mt-2">
                                {review.comment}
                            </p>
                            <button className="mt-2 flex items-center gap-1 text-neutral-400 hover:text-brand transition-colors text-[10px] font-medium">
                                <ThumbsUp size={10} />
                                Helpful
                            </button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};