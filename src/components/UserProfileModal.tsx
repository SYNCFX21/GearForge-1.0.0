import React, { useState, useEffect } from 'react';
import { UserProfile, SavedLoadout, Review, Report } from '../types';
import { X, Flag, User, Box, MessageSquare, Check, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getAllUsersFromFirestore, getLoadoutsFromFirestore, submitReportToFirestore, deleteLoadoutFromFirestore } from '../lib/firestore';
import { getReviewsForAccessory } from '../data/reviews';
import { ACCESSORY_CATALOG } from '../data/accessories';

interface UserProfileModalProps {
  username: string;
  currentUser?: UserProfile | null;
  onClose: () => void;
}

/**
 * UserProfileModal Component
 * Public member profile viewer displaying:
 * - Avatar, username, VIP badge, bio, and role
 * - Publicly shared saved PC and accessory loadouts
 * - Authored review history across all accessories
 * - Moderation report submission against inappropriate profiles
 * 
 * @whereUsed
 * - `src/components/AccessoryReviewSection.tsx` (clicking on a reviewer's avatar/name)
 * - `src/components/UserSearch.tsx` (clicking on a member in the search list)
 */
export default function UserProfileModal({ username, currentUser, onClose }: UserProfileModalProps) {
  const [profileUser, setProfileUser] = useState<UserProfile | null>(null);
  const [userLoadouts, setUserLoadouts] = useState<SavedLoadout[]>([]);
  const [userReviews, setUserReviews] = useState<{ accessoryId: string; accessoryName: string; review: Review }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Report state
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      
      // 1. Try to find the user in Firestore by displayName
      let foundUser: UserProfile | null = null;
      try {
        const allUsers = await getAllUsersFromFirestore();
        foundUser = allUsers.find(u => u.displayName === username) || null;
        setProfileUser(foundUser);
        
        // 2. If found, fetch their loadouts
        if (foundUser) {
          const loadouts = await getLoadoutsFromFirestore(foundUser.uid);
          setUserLoadouts(loadouts);
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      }
      
      // 3. Collect reviews made by this user
      const reviewsFound: { accessoryId: string; accessoryName: string; review: Review }[] = [];
      ACCESSORY_CATALOG.forEach(acc => {
        const data = getReviewsForAccessory(acc);
        data.reviews.forEach(r => {
          if (r.user === username) {
            reviewsFound.push({ accessoryId: acc.id, accessoryName: acc.name, review: r });
          }
        });
      });
      setUserReviews(reviewsFound);
      
      setIsLoading(false);
    };
    
    fetchUserData();
  }, [username]);

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !reportReason.trim()) return;
    
    setIsSubmittingReport(true);
    
    const newReport: Report = {
      id: `rep-usr-${Date.now()}`,
      reporterUid: currentUser.uid,
      reporterName: currentUser.displayName,
      reportedItemId: profileUser?.uid || `unknown-uid-${username}`,
      reportedItemType: 'post', // using 'post' or maybe 'profile' if we add it, but 'post' is fine or 'user'
      reportedContent: `User Profile: ${username}`,
      reportedUser: username,
      reason: reportReason.trim(),
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    
    await submitReportToFirestore(newReport);
    
    setIsSubmittingReport(false);
    setShowReportForm(false);
    setReportReason('');
    setReportSuccess(true);
    setTimeout(() => setReportSuccess(false), 3000);
  };

  const handleDeleteLoadout = async (loadoutId: string) => {
    if (!profileUser) return;
    const confirmDelete = window.confirm("Are you sure you want to delete this build?");
    if (!confirmDelete) return;
    
    // Optimistic UI update
    setUserLoadouts(prev => prev.filter(l => l.id !== loadoutId));
    
    // Backend deletion
    await deleteLoadoutFromFirestore(profileUser.uid, loadoutId);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[var(--app-bg)]/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-[#0a0a0c] border border-white/10 rounded-[32px] shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="p-5 border-b border-white/10 flex items-center justify-between shrink-0 bg-[var(--card-bg)] rounded-t-[32px]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full border-2 border-white/20 overflow-hidden shrink-0 bg-zinc-800 flex items-center justify-center">
              {profileUser?.photoURL ? (
                <img src={profileUser.photoURL} alt={username} className="w-full h-full object-cover" />
              ) : (
                <User className="w-6 h-6 text-zinc-400" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                {username}
                {profileUser?.isVip && (
                  <span className="text-[10px] bg-primary-500/20 text-primary-400 border border-primary-500/40 px-1.5 py-0.5 rounded font-black uppercase tracking-wider">
                    VIP
                  </span>
                )}
              </h2>
              <p className="text-xs text-zinc-400">
                {profileUser ? `Registered: ${profileUser.registeredAt}` : 'Community Member'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {currentUser && currentUser.displayName !== username && (
              <button
                onClick={() => setShowReportForm(true)}
                className="px-3 py-1.5 rounded-xl bg-primary-500/10 hover:bg-primary-500/20 text-primary-400 border border-primary-500/30 text-xs font-bold transition flex items-center gap-1.5"
              >
                <Flag className="w-3.5 h-3.5" />
                Report User
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-2xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {isLoading ? (
            <div className="py-10 text-center text-zinc-500 text-sm font-bold animate-pulse">Loading profile data...</div>
          ) : (
            <>
              {/* Saved Loadouts Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-2">
                  <Box className="w-4 h-4 text-emerald-400" />
                  Saved Builds ({userLoadouts.length})
                </h3>
                {userLoadouts.length === 0 ? (
                  <p className="text-xs text-zinc-500 italic px-2">No public loadouts saved yet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {userLoadouts.map(loadout => (
                      <div key={loadout.id} className="p-4 bg-[var(--app-bg)]/40 border border-white/5 rounded-2xl">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-white text-sm pr-2">{loadout.name}</h4>
                          <div className="flex flex-col items-end gap-2 shrink-0">
                            <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded">
                              ₱{loadout.budget.toLocaleString()}
                            </span>
                            {currentUser?.uid === profileUser?.uid && (
                              <button
                                onClick={() => handleDeleteLoadout(loadout.id)}
                                className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1 transition"
                              >
                                <Trash2 className="w-3 h-3" />
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-[10px] text-zinc-500 mb-3">{new Date(loadout.createdAt).toLocaleDateString()}</p>
                        <div className="flex flex-wrap gap-1">
                          {loadout.accessories.slice(0, 3).map(acc => (
                            <span key={acc.id} className="text-[9px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-zinc-300 truncate max-w-[100px]">
                              {acc.name}
                            </span>
                          ))}
                          {loadout.accessories.length > 3 && (
                            <span className="text-[9px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-zinc-500">
                              +{loadout.accessories.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Reviews Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-2">
                  <MessageSquare className="w-4 h-4 text-primary-400" />
                  Forum Comments & Reviews ({userReviews.length})
                </h3>
                {userReviews.length === 0 ? (
                  <p className="text-xs text-zinc-500 italic px-2">No reviews posted yet.</p>
                ) : (
                  <div className="space-y-3">
                    {userReviews.map((item, idx) => (
                      <div key={idx} className="p-4 bg-[var(--app-bg)]/40 border border-white/5 rounded-2xl">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-primary-300">{item.accessoryName}</span>
                          <span className="text-[10px] text-zinc-500">{item.review.date}</span>
                        </div>
                        <p className="text-sm text-zinc-300 italic">"{item.review.comment}"</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </motion.div>

      {/* Report Form Modal */}
      <AnimatePresence>
        {showReportForm && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-[var(--app-bg)]/90 backdrop-blur-xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[var(--card-bg)] border border-primary-500/40 p-6 rounded-3xl shadow-2xl"
            >
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Flag className="w-5 h-5 text-primary-500" />
                Report {username}
              </h3>
              <p className="text-xs text-zinc-400 mb-4">
                Please provide details on why you are reporting this user. This will be sent to the moderation team.
              </p>
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <textarea
                  required
                  rows={4}
                  placeholder="E.g. Harassment, spam, toxic behavior, etc."
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full bg-[var(--app-bg)]/50 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-primary-500/50 resize-none"
                />
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowReportForm(false)}
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Toast Notification */}
      <AnimatePresence>
        {reportSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 z-[80] p-4 bg-emerald-950/90 border border-emerald-500/30 text-emerald-400 rounded-2xl shadow-xl flex items-center gap-3"
          >
            <Check className="w-5 h-5" />
            <div className="text-sm font-bold">User reported to admins.</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
