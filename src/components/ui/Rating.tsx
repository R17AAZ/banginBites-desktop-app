import { Star } from 'lucide-react';

interface RatingProps {
    rating: number;
    totalReviews?: number;
    showCount?: boolean;
    showStars?: boolean;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'brand' | 'dark';
    className?: string;
}

export const Rating: React.FC<RatingProps> = ({
    rating,
    totalReviews,
    showCount = false,
    showStars = true,
    size = 'sm',
    variant = 'default',
    className = ''
}) => {
    const sizeClasses = {
        sm: { star: 12, text: 'text-[10px]', gap: 'gap-0.5' },
        md: { star: 14, text: 'text-xs', gap: 'gap-1' },
        lg: { star: 16, text: 'text-sm', gap: 'gap-1' }
    };

    const variantClasses = {
        default: 'text-brand',
        brand: 'text-brand',
        dark: 'text-neutral-700'
    };

    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <div className={`flex items-center ${sizeClasses[size].gap}`}>
                {showStars && [...Array(5)].map((_, i) => {
                    if (i < fullStars) {
                        return (
                            <Star
                                key={i}
                                size={sizeClasses[size].star}
                                className={`fill-current ${variantClasses[variant]} ${variantClasses[variant]}`}
                            />
                        );
                    } else if (i === fullStars && hasHalfStar) {
                        return (
                            <div key={i} className="relative">
                                <Star size={sizeClasses[size].star} className="text-neutral-300" />
                                <div className="absolute inset-0 overflow-hidden w-1/2">
                                    <Star size={sizeClasses[size].star} className={`fill-current ${variantClasses[variant]} ${variantClasses[variant]}`} />
                                </div>
                            </div>
                        );
                    } else {
                        return (
                            <Star
                                key={i}
                                size={sizeClasses[size].star}
                                className="text-neutral-300"
                            />
                        );
                    }
                })}
            </div>

            <span className={`font-bold ${sizeClasses[size].text} text-neutral-700`}>
                {rating.toFixed(1)}
            </span>

            {showCount && totalReviews !== undefined && (
                <span className={`${sizeClasses[size].text} text-neutral-400`}>
                    ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
                </span>
            )}
        </div>
    );
};