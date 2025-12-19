
import React, { useState, useEffect } from 'react';
import { X, Star, MessageSquare } from 'lucide-react';
import { Review } from '../types';
import { getReviews, addReview } from '../services/data';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
  itemTitle: string;
  itemType: 'exhibition' | 'artwork';
}

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, itemId, itemTitle, itemType }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [userName, setUserName] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setReviews(getReviews(itemId));
      // Reset form
      setRating(0);
      setUserName('');
      setComment('');
    }
  }, [isOpen, itemId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    setIsSubmitting(true);
    const newReview: Review = {
      id: Date.now().toString(),
      itemId,
      itemType,
      userName: userName || 'Anonymous Visitor',
      rating,
      comment,
      timestamp: Date.now(),
    };

    addReview(newReview);
    
    // Simulate slight delay for effect
    setTimeout(() => {
        setReviews(getReviews(itemId));
        setRating(0);
        setUserName('');
        setComment('');
        setIsSubmitting(false);
    }, 500);
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : '0.0';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
           <div>
             <h2 className="text-xl font-black tracking-tight mb-1">Reviews</h2>
             <p className="text-sm text-gray-500 font-medium">for {itemTitle}</p>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
             <X className="w-5 h-5" />
           </button>
        </div>

        <div className="flex-grow overflow-y-auto">
            {/* Stats */}
            <div className="p-8 text-center border-b border-gray-100 bg-white sticky top-0 z-10">
                <div className="text-5xl font-black mb-2 flex items-center justify-center gap-4">
                    <span>{averageRating}</span>
                    <Star className="w-8 h-8 text-yellow-400 fill-current" />
                </div>
                <p className="text-gray-400 text-sm uppercase tracking-widest">{reviews.length} Verified Reviews</p>
            </div>

            {/* Review List */}
            <div className="p-6 space-y-6">
                {reviews.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>No reviews yet. Be the first to share your thoughts!</p>
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-bold">{review.userName}</span>
                                <span className="text-xs text-gray-400">{new Date(review.timestamp).toLocaleDateString()}</span>
                            </div>
                            <div className="flex mb-3">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star 
                                        key={star} 
                                        className={`w-3 h-3 ${star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-200'}`} 
                                    />
                                ))}
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                        </div>
                    ))
                )}
            </div>
        </div>

        {/* Add Review Form */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Leave a Review</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Rating Input */}
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="focus:outline-none transition-transform hover:scale-110"
                        >
                            <Star 
                                className={`w-6 h-6 ${(hoverRating || rating) >= star ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                        </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-400 self-center">{rating > 0 ? 'Thanks!' : 'Rate this'}</span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <input 
                        type="text" 
                        placeholder="Your Name (Optional)" 
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-black transition-colors"
                    />
                    <textarea 
                        required
                        placeholder="Share your experience..." 
                        rows={2}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-black transition-colors resize-none"
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={isSubmitting || rating === 0}
                    className="w-full bg-black text-white py-3 rounded-lg font-bold text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Posting...' : 'Post Review'}
                </button>
            </form>
        </div>

      </div>
    </div>
  );
};

export default ReviewModal;
