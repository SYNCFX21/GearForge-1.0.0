import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RulesModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export default function RulesModal({ isOpen, onAccept, onDecline }: RulesModalProps) {
  const [isChecked, setIsChecked] = useState(false);
  const [showError, setShowError] = useState(false);

  if (!isOpen) return null;

  const handleAccept = () => {
    if (isChecked) {
      onAccept();
    } else {
      setShowError(true);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[var(--app-bg)]/90 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-lg bg-[var(--card-bg)] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="p-6 bg-gradient-to-br from-primary-500/10 to-[var(--card-bg)] border-b border-white/10 shrink-0">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[var(--app-bg)]/40 rounded-2xl border border-white/10 backdrop-blur-md">
                <ShieldAlert className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Community Rules</h2>
                <p className="text-sm font-medium text-primary-400 mt-1 tracking-wide">
                  Welcome to GearForge Forum
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
            <p className="text-sm text-zinc-300 leading-relaxed font-medium">
              To ensure a safe, helpful, and welcoming environment for all gamers, please read and agree to our community rules before proceeding.
            </p>

            <div className="space-y-4">
              {[
                {
                  title: "1. Be Respectful",
                  desc: "Treat everyone with respect. No toxicity, harassment, hate speech, or personal attacks."
                },
                {
                  title: "2. No Spam or Self-Promotion",
                  desc: "Do not spam the forum with duplicate posts, irrelevant links, or unauthorized advertisements."
                },
                {
                  title: "3. Keep it Relevant",
                  desc: "Ensure your posts and reviews are relevant to gaming gear, PC builds, and accessories."
                },
                {
                  title: "4. Honest Reviews",
                  desc: "Only post reviews for products you have actually used. No fake reviews or review bombing."
                }
              ].map((rule, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <h3 className="text-sm font-bold text-white mb-1">{rule.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{rule.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 p-4 bg-primary-500/10 border border-primary-500/30 rounded-2xl">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => {
                      setIsChecked(e.target.checked);
                      if (e.target.checked) setShowError(false);
                    }}
                    className="peer sr-only"
                  />
                  <div className="w-5 h-5 rounded-md border-2 border-white/20 peer-checked:bg-primary-500 peer-checked:border-primary-500 transition-colors flex items-center justify-center group-hover:border-primary-500/50">
                    <CheckCircle2 className="w-3.5 h-3.5 text-black opacity-0 peer-checked:opacity-100 transition-opacity" strokeWidth={3} />
                  </div>
                </div>
                <span className="text-sm font-medium text-white select-none">
                  I have read and agree to follow the GearForge Community Rules. I understand that violation may result in account suspension or a permanent ban.
                </span>
              </label>
              {showError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 flex items-center gap-2 text-xs text-red-400 bg-red-950/30 p-2 rounded-lg border border-red-500/20"
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>You must agree to the rules to continue.</span>
                </motion.div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10 bg-[var(--card-bg)] flex gap-3 shrink-0">
            <button
              onClick={onDecline}
              className="flex-1 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold transition-colors cursor-pointer"
            >
              Decline & Logout
            </button>
            <button
              onClick={handleAccept}
              className={`flex-1 py-3.5 rounded-2xl font-bold transition-all ${
                isChecked
                  ? 'bg-primary-500 text-black shadow-lg shadow-[var(--theme-color)]/20 hover:bg-[#00e5ff] cursor-pointer'
                  : 'bg-white/5 text-zinc-500 cursor-not-allowed border border-white/5'
              }`}
            >
              Accept Rules
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
