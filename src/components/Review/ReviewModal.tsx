import React, { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetName: string;
  targetImage?: string;
  onSubmit?: (data: { rating: number; comment: string }) => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  targetName,
  targetImage,
  onSubmit
}) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (rating === 0) return;
    if (onSubmit) {
      onSubmit({ rating, comment });
    }
    // Reset state for next use
    setTimeout(() => {
      setRating(0);
      setComment('');
    }, 300);
    onClose();
  };

  const getRatingText = (val: number) => {
    switch (val) {
      case 1: return "Terrible";
      case 2: return "Bad";
      case 3: return "Okay";
      case 4: return "Good";
      case 5: return "Amazing!";
      default: return "";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Give a Review"
      maxW="max-w-xl"
    >
      <div className="space-y-8">
        {/* Target Info */}
        <div className="flex items-center gap-4 bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
          {targetImage ? (
            <img
              src={targetImage}
              alt={targetName}
              className="w-16 h-16 rounded-xl object-cover border border-white shadow-sm"
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-brand/10 flex items-center justify-center text-brand border border-brand/10">
              <Star size={24} className="fill-current" />
            </div>
          )}
          <div>
            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-1">Reviewing</p>
            <h3 className="text-lg font-bold text-neutral-900 leading-tight font-heading">{targetName}</h3>
          </div>
        </div>

        {/* Star Rating Section */}
        <div className="text-center space-y-4">
          <p className="font-bold text-neutral-900 font-sans">How would you rate your experience?</p>
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
                className="focus:outline-none p-1 transition-colors"
                type="button"
              >
                <Star
                  size={42}
                  className={cn(
                    "transition-all duration-300 ease-out fill-transparent stroke-neutral-200 stroke-[1.5]",
                    (hoveredRating || rating) >= star && "fill-brand text-brand stroke-brand scale-110 drop-shadow-[0_0_10px_rgba(255,107,38,0.2)]"
                  )}
                />
              </motion.button>
            ))}
          </div>
          <div className="h-6">
            <motion.p
              key={hoveredRating || rating}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm font-bold text-brand uppercase tracking-widest"
            >
              {getRatingText(hoveredRating || rating)}
            </motion.p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="">
          <Textarea
            label="Write your review"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us what you loved... or what could be better!"
            className="min-h-[140px] rounded-2xl bg-neutral-50/50 border-neutral-200 focus:border-brand focus:bg-white transition-all text-base"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            onClick={handleSubmit}
            disabled={rating === 0}
            className={cn(
              "w-full h-14 rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition-all duration-300",
              rating > 0 ? "scale-100" : "opacity-50 grayscale"
            )}
          >
            Submit Review
            <Send size={18} className="translate-y-0.5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Button>
          <p className="text-center text-[10px] text-neutral-400 mt-4 leading-relaxed px-10">
            By submitting, you agree to our <span className="underline cursor-pointer">Review Policy</span> and certify this is your honest experience.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ReviewModal;
