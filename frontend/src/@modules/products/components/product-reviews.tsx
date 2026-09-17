'use client';

import React, { useState, useMemo } from 'react';
import { Star, CheckCircle, ThumbsUp, MessageSquare, Send, Filter } from 'lucide-react';
import { DEFAULT_STORE_REVIEWS } from '@/utils/productRating';
import { clx } from '@/lib/util/clx';

export interface ReviewItem {
  id: string;
  productId: string;
  rating: number;
  title: string;
  comment: string;
  author: {
    name: string;
    email?: string;
    avatar?: string;
  };
  isVerifiedBuyer: boolean;
  likesCount: number;
  createdAt: string;
}

interface ProductReviewsProps {
  productId: string;
  productTitle?: string;
  themeColor?: string;
}

export function ProductReviews({ productId, productTitle = 'Product', themeColor = 'blue' }: ProductReviewsProps) {
  const initialReviews: ReviewItem[] = useMemo(() => {
    const matched = DEFAULT_STORE_REVIEWS.filter(
      r => r.productId === productId || (!DEFAULT_STORE_REVIEWS.some(x => x.productId === productId) && r.productId === 'prod-1')
    );
    return matched.map(r => ({
      id: r.id,
      productId: r.productId,
      rating: r.rating,
      title: r.title,
      comment: r.comment,
      author: {
        name: r.authorName,
        email: r.authorEmail,
        avatar: r.authorAvatar
      },
      isVerifiedBuyer: r.verifiedPurchase ?? true,
      likesCount: 8,
      createdAt: r.date
    }));
  }, [productId]);

  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews);
  const [selectedFilter, setSelectedFilter] = useState<number | null>(null);

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [formRating, setFormRating] = useState(5);
  const [formTitle, setFormTitle] = useState('');
  const [formComment, setFormComment] = useState('');
  const [formAuthor, setFormAuthor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const totalReviews = reviews.length;
  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 5.0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return sum / reviews.length;
  }, [reviews]);

  const ratingDist = useMemo(() => {
    const dist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
      const rounded = Math.min(5, Math.max(1, Math.round(r.rating)));
      dist[rounded] = (dist[rounded] || 0) + 1;
    });
    return dist;
  }, [reviews]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formComment.trim()) return;

    setIsSubmitting(true);
    const newReview = {
      id: `rev-${Date.now()}`,
      productId,
      rating: formRating,
      title: formTitle || 'Verified Patron Review',
      comment: formComment,
      author: {
        name: formAuthor || 'Verified Patron',
        email: 'patron@mrbulk.co.za'
      },
      isVerifiedBuyer: true,
      likesCount: 0,
      createdAt: new Date().toISOString()
    };

    setTimeout(() => {
      setReviews(prev => [newReview, ...prev]);
      setSubmitSuccess(true);
      setFormTitle('');
      setFormComment('');
      setIsSubmitting(false);

      setTimeout(() => {
        setShowForm(false);
        setSubmitSuccess(false);
      }, 1500);
    }, 400);
  };

  const filteredReviews = selectedFilter
    ? reviews.filter(r => Math.round(r.rating) === selectedFilter)
    : reviews;

  return (
    <div className="space-y-8">
      {/* Header & Overall Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-4xl font-extrabold text-slate-900 dark:text-white">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex items-center gap-1 text-amber-400 my-1 justify-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={clx(
                    'w-4 h-4',
                    i < Math.round(averageRating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'
                  )}
                />
              ))}
            </div>
            <p className="text-xs text-slate-500">
              Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
            </p>
          </div>

          {/* Rating breakdown bars */}
          <div className="hidden sm:flex flex-col gap-1.5 min-w-[200px] border-l border-slate-200 dark:border-slate-800 pl-6">
            {[5, 4, 3, 2, 1].map(stars => {
              const count = ratingDist[stars] || 0;
              const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              return (
                <button
                  key={stars}
                  onClick={() => setSelectedFilter(selectedFilter === stars ? null : stars)}
                  className={clx(
                    'flex items-center gap-2 text-xs group text-left cursor-pointer',
                    selectedFilter === stars ? 'font-bold text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'
                  )}
                >
                  <span className="w-6 shrink-0">{stars} ★</span>
                  <div className="w-28 h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-6 text-[10px] text-slate-400 text-right">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:bg-slate-800 dark:hover:bg-slate-100 transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{showForm ? 'Cancel Review' : 'Write Verified Review'}</span>
          </button>
        </div>
      </div>

      {/* Review Submission Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="p-6 rounded-2xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-950/20 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Write a Review for {productTitle}
            </h4>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium">
              Verified Buyer
            </span>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Your Rating</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setFormRating(star)}
                  className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                >
                  <Star
                    className={clx(
                      'w-6 h-6',
                      star <= formRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'
                    )}
                  />
                </button>
              ))}
              <span className="text-xs text-slate-500 ml-2 font-medium">{formRating} out of 5 Stars</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Your Name</label>
              <input
                type="text"
                value={formAuthor}
                onChange={e => setFormAuthor(e.target.value)}
                placeholder="e.g. Alexander Vance"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Review Headline</label>
              <input
                type="text"
                value={formTitle}
                onChange={e => setFormTitle(e.target.value)}
                placeholder="e.g. Exceptional tone and build quality"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Your Feedback</label>
            <textarea
              required
              rows={3}
              value={formComment}
              onChange={e => setFormComment(e.target.value)}
              placeholder="Share your detailed experience with this artisan piece..."
              className="w-full text-xs p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {submitSuccess ? (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Thank you! Your verified review has been published.</span>
            </div>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting || !formComment.trim()}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs disabled:opacity-50 transition-all flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Send className="w-3 h-3" />
              <span>Submit Review</span>
            </button>
          )}
        </form>
      )}

      {/* Filter indicator */}
      {selectedFilter && (
        <div className="flex items-center justify-between text-xs px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-1.5 font-medium">
            <Filter className="w-3 h-3" />
            <span>Showing only {selectedFilter}-star reviews</span>
          </div>
          <button
            onClick={() => setSelectedFilter(null)}
            className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* Reviews List */}
      {filteredReviews.length === 0 ? (
        <div className="p-8 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 space-y-2">
          <p className="text-sm font-semibold">No reviews found matching criteria.</p>
          <p className="text-xs">Be the first patron to share your impressions of this piece.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map(r => (
            <div
              key={r.id}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  {r.author?.avatar ? (
                    <img src={r.author.avatar} alt={r.author.name} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center">
                      {r.author?.name?.charAt(0) || 'P'}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {r.author?.name || 'Verified Patron'}
                      </span>
                      {r.isVerifiedBuyer && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                          <CheckCircle className="w-3 h-3" /> Verified Buyer
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-0.5 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={clx(
                        'w-3 h-3',
                        i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'
                      )}
                    />
                  ))}
                </div>
              </div>

              {r.title && (
                <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                  {r.title}
                </h5>
              )}

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {r.comment}
              </p>

              <div className="pt-2 flex items-center gap-4 text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800/80">
                <button 
                  onClick={() => {
                    setReviews(prev => prev.map(item => item.id === r.id ? { ...item, likesCount: item.likesCount + 1 } : item));
                  }}
                  className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                >
                  <ThumbsUp className="w-3 h-3" />
                  <span>Helpful ({r.likesCount})</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
