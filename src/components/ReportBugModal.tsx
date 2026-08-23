import React, { useState } from 'react';
import { Bug, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, BugReport } from '../types';
import { submitBugReport } from '../lib/firestore';

interface ReportBugModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
}

export default function ReportBugModal({ isOpen, onClose, user }: ReportBugModalProps) {
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);
    setError(null);

    const report: BugReport = {
      id: `bug-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      userId: user.uid,
      userEmail: user.email,
      userName: user.displayName,
      description: description.trim(),
      status: 'open',
      createdAt: Date.now(),
    };

    try {
      await submitBugReport(report);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setDescription('');
        onClose();
      }, 2000);
    } catch (err) {
      console.error(err);
      setError('Failed to submit bug report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-[var(--card-bg)] border border-red-500/20 rounded-[32px] shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 sm:p-8 pb-0 flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-red-500/20 rounded-2xl flex items-center justify-center shrink-0 border border-red-500/30">
                <Bug className="w-7 h-7 text-red-500" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Report a Bug</h2>
                <p className="text-sm text-red-400/80 font-medium">Found an issue? Let us know.</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-8">
            {success ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Send className="w-6 h-6 text-emerald-500" />
                </div>
                <h3 className="text-lg font-bold text-emerald-400">Report Submitted</h3>
                <p className="text-sm text-zinc-400">Thanks for helping us improve GearForge!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-xs font-bold text-center">
                    {error}
                  </div>
                )}
                
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                    Describe the Issue
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What were you doing when the issue occurred? What did you expect to happen?"
                    className="w-full bg-[var(--app-bg)] border border-white/10 rounded-2xl p-4 text-white placeholder-zinc-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition resize-none h-32 text-sm"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !description.trim()}
                  className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm transition shadow-lg shadow-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    'Submitting...'
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Bug Report
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
