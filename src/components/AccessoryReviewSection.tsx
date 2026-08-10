import React, { useState, useEffect } from 'react';
import { Accessory, Review, UserProfile, Report } from '../types';
import { getReviewsForAccessory, submitUserReview, deleteReview } from '../data/reviews';
import { submitReportToFirestore } from '../lib/firestore';
import { Star, MessageSquare, Plus, Check, X, Shield, VolumeX, Flag, User, Trash2 } from 'lucide-react';
import UserProfileModal from './UserProfileModal';
import { AnimatePresence } from 'motion/react';

interface AccessoryReviewSectionProps {
  accessory: Accessory;
  onReviewAdded?: () => void;
  currentUser?: UserProfile | null;
}

export default function AccessoryReviewSection({ accessory, onReviewAdded, currentUser }: AccessoryReviewSectionProps) {
  const [data, setData] = useState<{ reviews: Review[]; communitySentiment: string }>({
    reviews: [],
    communitySentiment: ''
  });

  // State for the review form
  const [showForm, setShowForm] = useState(false);
  const [formRating, setFormRating] = useState(5);
  const [formTagline, setFormTagline] = useState('');
  const [formComment, setFormComment] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [reportingReview, setReportingReview] = useState<Review | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [selectedProfileUser, setSelectedProfileUser] = useState<string | null>(null);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);

  const isUserMuted = currentUser?.isMuted;

  // Load reviews on mount or whenever accessory.id changes
  const loadReviews = () => {
    const res = getReviewsForAccessory(accessory);
    setData(res);
  };

  useEffect(() => {
    loadReviews();
  }, [accessory.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formComment.trim()) return;

    // Submit the review
    submitUserReview(
      accessory.id,
      currentUser?.displayName || "Gamer",
      formRating,
      formComment.trim(),
      formTagline.trim() || "Verified Buyer"
    );

    // Refresh reviews
    loadReviews();

    // Reset form states
    setFormRating(5);
    setFormTagline('');
    setFormComment('');
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
    setShowForm(false);

    if (onReviewAdded) {
      onReviewAdded();
    }
  };

  // Helper to generate star distribution bar width percentage
  const getDistributionPercentage = (stars: number) => {
    if (data.reviews.length === 0) return 0;
    const count = data.reviews.filter(r => r.rating === stars).length;
    return Math.round((count / data.reviews.length) * 100);
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportingReview || !currentUser || !reportReason.trim()) return;
    
    setIsSubmittingReport(true);
    
    const newReport: Report = {
      id: `rep-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      reporterUid: currentUser.uid,
      reporterName: currentUser.displayName,
      reportedItemId: reportingReview.id,
      reportedItemType: 'review',
      reportedContent: reportingReview.comment,
      reportedUser: reportingReview.user,
      reason: reportReason.trim(),
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    
    await submitReportToFirestore(newReport);
    
    setIsSubmittingReport(false);
    setReportingReview(null);
    setReportReason('');
    setReportSuccess(true);
    setTimeout(() => setReportSuccess(false), 3000);
  };

  const confirmDeleteReview = () => {
    if (reviewToDelete) {
      deleteReview(reviewToDelete);
      loadReviews();
      setReviewToDelete(null);
    }
  };

  return (
    <div id={`review-section-${accessory.id}`} className="mt-4 pt-4 border-t border-white/8 space-y-5">
      
      {/* Community Opinion & Rating Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-[var(--app-bg)]/45 p-4 rounded-2xl border border-white/5">
        
        {/* Rating Breakdown Col */}
        <div className="sm:col-span-5 flex flex-col items-center justify-center text-center border-b sm:border-b-0 sm:border-r border-white/8 pb-3 sm:pb-0 sm:pr-4">
          <span className="text-3xl font-extrabold text-white font-mono">{accessory.rating}</span>
          <div className="flex items-center gap-0.5 mt-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-3.5 h-3.5 ${
                  s <= Math.round(accessory.rating)
                    ? 'fill-primary-500 text-primary-500'
                    : 'text-white/10'
                }`}
              />
            ))}
          </div>
          <span className="text-xxs text-zinc-400 mt-1.5 font-semibold font-mono">
            Based on {data.reviews.length} community feedbacks
          </span>
        </div>

        {/* Community Sentiment Verdict Box */}
        <div className="sm:col-span-7 space-y-1 sm:pl-2">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-predator-cyan" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-predator-cyan font-mono">PH Community Opinion</span>
          </div>
          <p className="text-xxs text-zinc-300 leading-relaxed font-sans italic">
            "{data.communitySentiment}"
          </p>
        </div>
      </div>

      {/* Mini Bar distribution chart (Optional eye-candy) */}
      <div className="space-y-1 bg-[var(--app-bg)]/20 border border-white/8 p-3 rounded-2xl text-xxs text-zinc-400 font-mono">
        <span className="font-bold text-[9px] uppercase tracking-widest text-predator-cyan block mb-1.5">Review Distribution</span>
        {[5, 4, 3, 2, 1].map((stars) => {
          const pct = getDistributionPercentage(stars);
          return (
            <div key={stars} className="flex items-center gap-2">
              <span className="w-3 text-right font-semibold">{stars}★</span>
              <div className="flex-1 h-1.5 bg-[#141821] border border-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-predator-cyan shadow-[0_0_8px_rgba(0,242,255,0.7)] rounded-full transition-all duration-500" 
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-6 text-right text-zinc-500">{pct}%</span>
            </div>
          );
        })}
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        {/* Muted Warning Banner */}
        {isUserMuted && (
          <div className="p-3 bg-primary-500/15 border border-primary-500/40 rounded-2xl flex items-center gap-2.5 text-primary-200 text-xs font-semibold">
            <VolumeX className="w-4 h-4 text-primary-400 shrink-0" />
            <div>
              <span className="font-extrabold block text-primary-300">Account Muted</span>
              <p className="text-[11px] text-primary-200/80">
                Your account is currently muted until <strong>{currentUser.mutedUntil || 'specified date'}</strong>. You cannot write reviews or forum comments.
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono block">Gamer Reviews ({data.reviews.length})</span>
          
          <button
            type="button"
            disabled={isUserMuted}
            onClick={() => setShowForm(!showForm)}
            className={`flex items-center gap-1.5 text-xs font-bold py-1.5 px-3 rounded-full uppercase tracking-wider transition cursor-pointer ${
              isUserMuted
                ? 'bg-purple-950/40 text-primary-400 border border-primary-500/30 opacity-60 cursor-not-allowed'
                : 'text-white hover:bg-[#0090e0] bg-[var(--theme-color)]'
            }`}
          >
            {isUserMuted ? <VolumeX className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
            <span>{isUserMuted ? 'Muted (Posting Disabled)' : 'Write Review'}</span>
          </button>
        </div>

        {/* Success notification if posted */}
        {isSuccess && (
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl text-xxs font-bold text-center">
            Maraming salamat! Review submitted successfully.
          </div>
        )}

        {/* Submission Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="border border-white/8 p-4 rounded-3xl space-y-3 bg-[#141821]/80">
            <div className="space-y-1">
              <label className="text-[9px] font-extrabold uppercase tracking-widest text-predator-cyan font-mono block">Review Tagline</label>
              <input
                type="text"
                placeholder="e.g. Creamy sounding!"
                value={formTagline}
                onChange={(e) => setFormTagline(e.target.value)}
                className="w-full bg-[var(--app-bg)]/40 border border-white/8 rounded-xl p-2.5 text-xxs text-white focus:outline-none focus:border-predator-cyan focus:ring-1 focus:ring-predator-cyan/30"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div className="space-y-1">
                <label className="text-[9px] font-extrabold uppercase tracking-widest text-predator-cyan font-mono block">Rating</label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((stars) => (
                    <button
                      type="button"
                      key={stars}
                      onClick={() => setFormRating(stars)}
                      className="p-1 hover:scale-115 transition cursor-pointer"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          stars <= formRating
                            ? 'fill-primary-500 text-primary-500'
                            : 'text-white/10'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-1.5 mt-2 sm:mt-0">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="py-1.5 px-3 border border-white/5 rounded-xl text-xxs font-extrabold uppercase tracking-widest text-zinc-400 hover:text-white transition font-mono cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-1.5 px-3 bg-[var(--theme-color)] text-white hover:bg-[#0090e0] rounded-xl text-xs font-bold uppercase tracking-widest transition cursor-pointer"
                >
                  Post Review
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-extrabold uppercase tracking-widest text-predator-cyan font-mono block">Your Comment (Taglish welcomed!)</label>
              <textarea
                rows={2}
                required
                placeholder="Write your honest opinion about performance, shipping packaging, or durability..."
                value={formComment}
                onChange={(e) => setFormComment(e.target.value)}
                className="w-full bg-[var(--app-bg)]/40 border border-white/8 rounded-xl p-2.5 text-xxs text-white focus:outline-none focus:border-predator-cyan focus:ring-1 focus:ring-predator-cyan/30 resize-none"
              />
            </div>
          </form>
        )}

        {/* Comments Feed list */}
        <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
          {data.reviews.map((rev) => (
            <div key={rev.id} className="p-3 bg-[var(--app-bg)]/20 border border-white/5 rounded-2xl space-y-1 text-xxs">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-2">
                  {/* User Avatar */}
                  <button
                    onClick={() => setSelectedProfileUser(rev.user)}
                    className="w-6 h-6 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center shrink-0 mt-0.5 hover:ring-2 hover:ring-[var(--theme-color)] transition-all cursor-pointer overflow-hidden"
                    title={`View ${rev.user}'s profile`}
                  >
                    <User className="w-3.5 h-3.5 text-zinc-400" />
                  </button>
                  
                  <div>
                    <div className="flex items-center gap-1.5">
                      <button 
                        onClick={() => setSelectedProfileUser(rev.user)}
                        className="font-bold text-white hover:text-primary-400 transition cursor-pointer"
                      >
                        {rev.user}
                      </button>
                      <span className="text-[9px] text-zinc-500 font-mono">{rev.date}</span>
                    </div>
                    {rev.tagline && (
                      <span className="text-[9px] font-extrabold text-predator-cyan bg-predator-cyan/10 px-1.5 py-0.25 rounded block mt-0.5 w-max font-mono uppercase tracking-wider">
                        {rev.tagline}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-2.5 h-2.5 ${
                        s <= rev.rating
                          ? 'fill-primary-500 text-primary-500'
                          : 'text-white/10'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-zinc-300 leading-normal mt-1 italic font-sans">
                "{rev.comment}"
              </p>

              <div className="flex justify-end gap-3 pt-1">
                {currentUser?.role === 'super_admin' && (
                  <button
                    type="button"
                    onClick={() => setReviewToDelete(rev.id)}
                    className="flex items-center gap-1 text-[9px] text-zinc-500 hover:text-red-500 font-bold transition font-mono cursor-pointer"
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                    <span>Delete</span>
                  </button>
                )}
                {currentUser && currentUser.displayName !== rev.user && (
                  <button
                    type="button"
                    onClick={() => setReportingReview(rev)}
                    className="flex items-center gap-1 text-[9px] text-zinc-500 hover:text-primary-400 font-bold transition font-mono cursor-pointer"
                  >
                    <Flag className="w-2.5 h-2.5" />
                    <span>Report</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {reviewToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--app-bg)]/80 backdrop-blur-sm">
          <div className="bg-[#141821] border border-red-500/30 p-6 rounded-3xl max-w-sm w-full shadow-2xl relative">
            <button
              onClick={() => setReviewToDelete(null)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-red-500" />
              Delete Review
            </h3>
            <p className="text-sm text-zinc-300 mb-6">
              Are you sure you want to permanently delete this review? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setReviewToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteReview}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {reportingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--app-bg)]/80 backdrop-blur-sm">
          <div className="bg-[#141821] border border-white/10 p-6 rounded-3xl max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setReportingReview(null)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Flag className="w-4 h-4 text-primary-500" />
              Report Review
            </h3>
            <p className="text-xs text-zinc-400 mb-4">
              You are reporting a review by <strong className="text-white">{reportingReview.user}</strong>. Please provide a reason below.
            </p>
            <form onSubmit={handleReportSubmit} className="space-y-4">
              <textarea
                autoFocus
                required
                rows={3}
                placeholder="Why is this review inappropriate? (e.g. spam, harassment, false information)"
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full bg-[var(--app-bg)]/50 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-primary-500/50 resize-none"
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setReportingReview(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReport || !reportReason.trim()}
                  className="px-4 py-2 bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 border border-primary-500/30 rounded-xl text-xs font-bold transition disabled:opacity-50"
                >
                  {isSubmittingReport ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Report Success Toast */}
      {reportSuccess && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 rounded-2xl shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <Check className="w-5 h-5" />
          <div className="text-sm font-bold">Report submitted to admins.</div>
        </div>
      )}
      
      {/* User Profile Modal */}
      <AnimatePresence>
        {selectedProfileUser && (
          <UserProfileModal 
            username={selectedProfileUser} 
            currentUser={currentUser} 
            onClose={() => setSelectedProfileUser(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
