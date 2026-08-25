import React, { useState } from 'react';
import { 
  Crown, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  Database, 
  FileDown, 
  X, 
  Check, 
  Ban, 
  Gauge, 
  TrendingDown,
  TrendingUp, 
  Bot,
  CreditCard,
  Clock,
  ShieldCheck,
  User,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';
import AvatarChoiceModal from './AvatarChoiceModal';

interface PremiumFeaturesProposalProps {
  user?: UserProfile | null;
  onUpdateUser?: (updatedUser: UserProfile, msg: string) => void;
  onNavigateTab?: (tabId: string) => void;
}

/**
 * PremiumFeaturesProposal Component
 * GearForge VIP subscription showcase and simulator.
 * Outlines premium membership perks:
 * - Ad-free browsing
 * - Unlimited AI loadout generation
 * - PDF build sheet export
 * - Exclusive custom themes and VIP avatar badges
 * - Instant simulated GCash/Maya checkout
 * 
 * @whereUsed
 * - `src/App.tsx` (rendered under the 'premium' active tab)
 */
export default function PremiumFeaturesProposal({ user, onUpdateUser, onNavigateTab }: PremiumFeaturesProposalProps) {
  const [showModal, setShowModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [activeDemo, setActiveDemo] = useState<'pro' | 'export' | 'consultant'>('pro');
  const [demoSuccess, setDemoSuccess] = useState<string | null>(null);

  const isVipOrAdFree = Boolean(user?.isVip || user?.hasPermanentAdFree || user?.role === 'super_admin' || user?.role === 'admin');

  const handleRunDemoAction = (msg: string) => {
    setDemoSuccess(msg);
    setTimeout(() => setDemoSuccess(null), 3500);
  };

  const handleClaimTrial = () => {
    if (!user || !onUpdateUser) return;
    const now = new Date();
    const expires = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const trialUser: UserProfile = {
      ...user,
      isVip: true,
      isTrialActive: true,
      vipTierName: '7-Day VIP Free Trial',
      trialEndsAt: expires.toISOString(),
      vipExpiresAt: expires.toISOString()
    };
    onUpdateUser(trialUser, "🎉 7-Day VIP Free Trial Activated! Enjoy all premium AI tools & ad-free experience.");
    setShowModal(false);
  };

  const handleBuyPermanentAdFree = () => {
    if (!user || !onUpdateUser) return;
    const adFreeUser: UserProfile = {
      ...user,
      hasPermanentAdFree: true,
      vipTierName: user.isVip ? user.vipTierName : 'Permanent Ad-Free Member',
      vipExpiresAt: 'Lifetime Access (Never Expires)'
    };
    onUpdateUser(adFreeUser, "⚡ Permanent Ad-Free Status Unlocked for ₱70! All ads permanently disabled.");
    setShowCheckoutModal(false);
    setShowModal(false);
  };

  const handleSubscribeVip = () => {
    if (!user || !onUpdateUser) return;
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const vipUser: UserProfile = {
      ...user,
      isVip: true,
      isTrialActive: false,
      vipTierName: 'VIP Gamer Pass (₱99/mo)',
      vipExpiresAt: expires.toISOString()
    };
    onUpdateUser(vipUser, "👑 Upgraded to VIP Gamer Pass! Full cloud builds & 24/7 AI PC Consultant unlocked.");
    setShowModal(false);
  };

  const handleSelectAvatar = (photoURL: string, avatarName: string) => {
    if (!user || !onUpdateUser) return;
    const updatedUser: UserProfile = {
      ...user,
      photoURL
    };
    onUpdateUser(updatedUser, `✨ Avatar updated to ${avatarName}!`);
  };

  // Helper function to format VIP expiration date display
  const getVipExpirationDisplay = () => {
    if (!user) {
      return { label: "Active Status", formattedDate: "Active", timeLeft: "Active", color: "text-primary-300" };
    }

    if (user.isTrialActive && user.trialEndsAt) {
      try {
        const endDate = new Date(user.trialEndsAt);
        const diffMs = endDate.getTime() - Date.now();
        const diffHours = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)));
        const diffDays = Math.floor(diffHours / 24);
        const remainingHours = diffHours % 24;

        return {
          label: "7-Day Free Trial",
          formattedDate: endDate.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          timeLeft: diffMs > 0 ? `${diffDays}d ${remainingHours}h remaining` : "Expired",
          color: "text-primary-400"
        };
      } catch (e) {
        return { label: "7-Day Free Trial", formattedDate: "Active", timeLeft: "7 Days", color: "text-primary-400" };
      }
    }

    if (user.hasPermanentAdFree && !user.isVip) {
      return {
        label: "Permanent Ad-Free Pass",
        formattedDate: "Lifetime Access",
        timeLeft: "Never Expires",
        color: "text-emerald-400"
      };
    }

    if (user.vipExpiresAt) {
      if (user.vipExpiresAt.includes('Lifetime')) {
        return {
          label: user.vipTierName || "VIP Pass",
          formattedDate: "Lifetime Access",
          timeLeft: "Never Expires",
          color: "text-primary-300"
        };
      }
      try {
        const endDate = new Date(user.vipExpiresAt);
        return {
          label: user.vipTierName || "VIP Gamer Pass",
          formattedDate: endDate.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }),
          timeLeft: "Active Subscription",
          color: "text-primary-300"
        };
      } catch (e) {
        return { label: user.vipTierName || "VIP Member", formattedDate: "Active", timeLeft: "Active", color: "text-primary-300" };
      }
    }

    // Default fallback expiration date (30 days from now or registration)
    const fallbackDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    return {
      label: user.vipTierName || "VIP Gamer Pass",
      formattedDate: fallbackDate.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }),
      timeLeft: "Active",
      color: "text-primary-300"
    };
  };

  const vipExpInfo = getVipExpirationDisplay();

  return (
    <>
      {/* 1. VIP Active Status Card (Shown when user is VIP or Ad-Free, hiding promotional sales banner) */}
      {isVipOrAdFree ? (
        <div className="bg-[var(--card-bg)] border border-white/10 p-4 sm:p-6 rounded-2xl sm:rounded-[32px] backdrop-blur-2xl shadow-2xl relative overflow-hidden my-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3.5 py-1 rounded-full bg-primary-500/20 border border-primary-500/40 text-primary-300 text-xs font-extrabold uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                  <Crown className="w-3.5 h-3.5 text-primary-400 fill-primary-400" />
                  <span>VIP Membership Active</span>
                </span>
                <span className="px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                  0 Banner Ads • Unlimited AI Features
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative group cursor-pointer" onClick={() => setShowAvatarModal(true)}>
                  <img
                    src={user?.photoURL || 'https://api.dicebear.com/7.x/bottts/svg?seed=GamerPH'}
                    alt="User Avatar"
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-primary-400/80 shadow-lg group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 rounded-full bg-[var(--app-bg)]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] text-primary-300 font-extrabold">
                    Change
                  </div>
                </div>

                <div className="space-y-1">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                    <span>{user?.displayName}</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-lg bg-primary-500/20 text-primary-300 border border-white/10 font-bold">
                      {vipExpInfo.label}
                    </span>
                  </h2>

                  {/* VIP Membership Expiration Date Indicator */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                    <span className="flex items-center gap-1.5 font-semibold text-zinc-400">
                      <Calendar className="w-4 h-4 text-primary-400" />
                      <span>VIP Membership Expires: <strong className={vipExpInfo.color}>{vipExpInfo.formattedDate}</strong></span>
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-white/10 text-zinc-400 font-mono text-[11px]">
                      ({vipExpInfo.timeLeft})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setShowAvatarModal(true)}
                className="flex items-center justify-center gap-2 bg-primary-500/20 hover:bg-primary-500/30 border border-white/10 text-primary-300 font-extrabold text-xs px-4 py-3 rounded-2xl transition cursor-pointer"
              >
                <User className="w-4 h-4 text-primary-400" />
                <span>Change Avatar (8 Presets)</span>
              </button>

              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs px-4 py-3 rounded-2xl transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-primary-400" />
                <span>View All VIP Perks</span>
              </button>
            </div>
          </div>

          {/* Unlocked VIP Perks Summary Cards with Direct Quick-Launch Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-primary-500/20">
            <div className="p-3.5 rounded-2xl bg-[var(--app-bg)]/50 border border-white/10 flex flex-col justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider block">Unlocked Perk</span>
                  <h3 className="text-xs font-bold text-white mt-0.5">0 Banner Ads</h3>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Clean ad-free interface active.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab?.('preset')}
                className="w-full mt-1 py-1.5 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-extrabold text-[11px] flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <span>Configurator Tab</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-[var(--app-bg)]/50 border border-white/10 flex flex-col justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-primary-500/20 text-primary-400 shrink-0">
                  <Gauge className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-primary-300 uppercase tracking-wider block">Unlocked Perk</span>
                  <h3 className="text-xs font-bold text-white mt-0.5">AI FPS Predictor</h3>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Predict gaming FPS across esports games.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab?.('builder')}
                className="w-full mt-1 py-1.5 px-3 rounded-xl bg-primary-500/10 hover:bg-primary-500/20 border border-white/10 text-primary-300 font-extrabold text-[11px] flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <span>Open FPS Builder</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-[var(--app-bg)]/50 border border-white/10 flex flex-col justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-primary-500/20 text-primary-400 shrink-0">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-primary-300 uppercase tracking-wider block">Unlocked Perk</span>
                  <h3 className="text-xs font-bold text-white mt-0.5">Price Trends & Graphs</h3>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Historical PH price graphs & drop alerts.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab?.('price')}
                className="w-full mt-1 py-1.5 px-3 rounded-xl bg-primary-500/10 hover:bg-primary-500/20 border border-white/10 text-primary-300 font-extrabold text-[11px] flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <span>Open Price History</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-[var(--app-bg)]/50 border border-white/10 flex flex-col justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-primary-500/20 text-primary-400 shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-primary-300 uppercase tracking-wider block">Unlocked Perk</span>
                  <h3 className="text-xs font-bold text-white mt-0.5">24/7 AI PC Consultant</h3>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Unlimited hardware & build consultations.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab?.('ai')}
                className="w-full mt-1 py-1.5 px-3 rounded-xl bg-primary-500/10 hover:bg-primary-500/20 border border-white/10 text-primary-300 font-extrabold text-[11px] flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <span>Open AI Concierge</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* 2. Promotional Sales Offer Banner (Shown ONLY when user is NOT VIP/Ad-Free) */
        <div className="bg-gradient-to-br from-[var(--card-bg)] to-[var(--app-bg)] border border-white/10 p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-[32px] backdrop-blur-2xl shadow-2xl relative overflow-hidden my-6">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3.5 py-1 rounded-full bg-primary-500/20 border border-primary-500/40 text-primary-300 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                  <Crown className="w-3.5 h-3.5 text-primary-400 fill-primary-400" />
                  <span>GearForge VIP & Perks</span>
                </span>
                <span className="px-3 py-0.5 rounded-full bg-white/10 text-zinc-400 text-xs font-semibold">
                  Permanent No Ads for ₱70 • 7-Day Free Trial
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Upgrade Your Experience: <span className="text-primary-400">₱70 Permanent No Ads</span> or <span className="text-primary-300">7-Day VIP Free Trial</span>
              </h2>

              <p className="text-sm text-zinc-400 leading-relaxed">
                Core budget calculations remain <strong className="text-white">100% free forever</strong>. basic users can remove all ads permanently for <strong className="text-emerald-300">₱70 one-time</strong>, or activate a <strong className="text-primary-300">7-Day Free Trial</strong> of all VIP features (AI FPS predictor, price trend graphs, unlimited loadouts & AI PC Consultant).
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
              <button
                onClick={handleClaimTrial}
                className="flex items-center justify-center gap-2 bg-primary-500/20 hover:bg-primary-500/30 border border-white/10 text-primary-300 font-extrabold text-xs px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl transition-all cursor-pointer"
              >
                <Clock className="w-4 h-4 text-primary-400" />
                <span>Start 7-Day Free Trial</span>
              </button>

              <button
                onClick={() => setShowCheckoutModal(true)}
                className="flex items-center justify-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-emerald-300 font-extrabold text-xs px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl transition-all cursor-pointer"
              >
                <Ban className="w-4 h-4 text-emerald-400" />
                <span>Remove Ads (₱70 Permanent)</span>
              </button>

              <button
                onClick={() => setShowModal(true)}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-black font-extrabold text-xs sm:text-sm px-5 py-3.5 sm:px-6 sm:py-4 rounded-2xl shadow-xl shadow-primary-500/20 transition-all cursor-pointer active:scale-95"
              >
                <Sparkles className="w-4 h-4 fill-black" />
                <span>Explore All Tiers</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-primary-500/20">
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[var(--app-bg)]/40 border border-white/10 flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-primary-500/20 text-primary-400 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-primary-300 uppercase tracking-wider block">7-Day Trial</span>
                <h3 className="text-sm font-bold text-white mt-0.5">Free VIP Pass Test Drive</h3>
                <p className="text-xs text-zinc-400 mt-1">Unlock all AI & VIP features for 7 days with 0 commitment.</p>
              </div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-[var(--app-bg)]/40 border border-white/10 flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                <Ban className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">₱70 Permanent</span>
                <h3 className="text-sm font-bold text-white mt-0.5">Permanent Ad-Free</h3>
                <p className="text-xs text-zinc-400 mt-1">One-time ₱70 payment to permanently disable all banner ads.</p>
              </div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-[var(--app-bg)]/40 border border-white/10 flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-primary-500/20 text-primary-400 shrink-0">
                <Gauge className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-primary-300 uppercase tracking-wider block">Gaming Optimizer</span>
                <h3 className="text-sm font-bold text-white mt-0.5">AI Gaming Performance</h3>
                <p className="text-xs text-zinc-400 mt-1">AI FPS predictor & hardware compatibility analyzer.</p>
              </div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-[var(--app-bg)]/40 border border-white/10 flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-primary-500/20 text-primary-400 shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-primary-300 uppercase tracking-wider block">VIP Concierge</span>
                <h3 className="text-sm font-bold text-white mt-0.5">24/7 AI PC Consultant</h3>
                <p className="text-xs text-zinc-400 mt-1">Personal hardware builder concierge for PC setups.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8-Default Avatar Choice Modal */}
      {user && (
        <AvatarChoiceModal
          isOpen={showAvatarModal}
          onClose={() => setShowAvatarModal(false)}
          currentUser={user}
          onSelectAvatar={handleSelectAvatar}
        />
      )}

      {/* Checkout Modal for ₱70 Permanent Ad Removal */}
      <AnimatePresence>
        {showCheckoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--app-bg)]/80 backdrop-blur-xl overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[color-mix(in_srgb,var(--card-bg)_80%,white)] border border-emerald-500/40 rounded-[28px] sm:rounded-[32px] p-5 sm:p-7 max-w-md w-full shadow-2xl relative my-6 overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/10 text-zinc-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Ban className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white">Remove Ads Permanent</h3>
                  <p className="text-xs text-zinc-400">One-time payment of ₱70 (No Subscription)</p>
                </div>
              </div>

              <div className="mt-5 p-4 rounded-2xl bg-[var(--app-bg)]/50 border border-white/10 space-y-3">
                <div className="flex justify-between items-center text-xs pb-2 border-b border-white/10">
                  <span className="text-zinc-400">Product:</span>
                  <span className="font-bold text-white">GearForge Permanent Ad-Free Pass</span>
                </div>
                <div className="flex justify-between items-center text-xs pb-2 border-b border-white/10">
                  <span className="text-zinc-400">Total Price:</span>
                  <span className="font-extrabold text-emerald-400 text-sm">₱70.00 PHP</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400">Validity:</span>
                  <span className="font-bold text-emerald-300">Lifetime / Permanent</span>
                </div>
              </div>

              <div className="mt-5 space-y-2.5">
                <p className="text-xs font-semibold text-zinc-400">Select Payment Method (Simulated Test Checkout):</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleBuyPermanentAdFree}
                    className="p-3 rounded-xl bg-primary-600/20 border border-primary-500/40 hover:bg-primary-600/30 text-primary-300 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>GCash / Maya (₱70)</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleBuyPermanentAdFree}
                    className="p-3 rounded-xl bg-emerald-600/20 border border-emerald-500/40 hover:bg-emerald-600/30 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Card / Debit (₱70)</span>
                  </button>
                </div>
              </div>

              <div className="mt-6 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowCheckoutModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 text-zinc-400 font-semibold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleBuyPermanentAdFree}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition cursor-pointer"
                >
                  Confirm & Unlock ₱70 Ad-Free
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main VIP & Tier Comparison Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[var(--app-bg)]/80 backdrop-blur-xl overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[color-mix(in_srgb,var(--card-bg)_80%,white)] border border-white/10 rounded-[24px] sm:rounded-[32px] p-4 sm:p-6 md:p-8 max-w-4xl w-full shadow-2xl relative my-4 sm:my-8 overflow-hidden max-h-[85vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-white/10 text-zinc-400 hover:text-white hover:bg-white/20 transition cursor-pointer z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="p-2.5 sm:p-3 rounded-2xl bg-primary-500/20 text-primary-400 border border-white/10">
                  <Crown className="w-5 h-5 sm:w-6 sm:h-6 fill-primary-400" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">GearForge Membership Options</h2>
                  <p className="text-xs text-zinc-400 mt-0.5">Choose Free Tier, 7-Day VIP Free Trial, Permanent No Ads (₱70), or VIP Gamer Pass (₱99/mo)</p>
                </div>
              </div>

              {/* Demo Success Toast */}
              {demoSuccess && (
                <div className="mt-4 p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{demoSuccess}</span>
                </div>
              )}

              {/* Proposed Tier Breakdown - 3 Column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-6">
                
                {/* 1. Free Tier Column */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-white/10">
                      <div>
                        <h3 className="font-extrabold text-white text-base">Free Tier</h3>
                        <p className="text-[11px] text-zinc-400">Basic Builder & Catalog</p>
                      </div>
                      <span className="text-lg font-bold text-zinc-400">₱0</span>
                    </div>

                    <ul className="space-y-2.5 text-xs text-zinc-400 font-medium">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Full Access to 33+ Gaming Gear Catalog</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Interactive Budget Calculator</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Hardware Compatibility Checks</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Up to 3 Saved Custom Loadouts</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={handleClaimTrial}
                    className="w-full py-2.5 px-3 rounded-xl bg-primary-500/20 hover:bg-primary-500/30 border border-primary-500/40 text-primary-300 font-extrabold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer mt-4"
                  >
                    <Clock className="w-3.5 h-3.5 text-primary-400" />
                    <span>Claim 7-Day Free Trial</span>
                  </button>
                </div>

                {/* 2. Permanent No Ads (₱70) Column */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-emerald-950/30 to-black border border-emerald-500/40 space-y-4 flex flex-col justify-between relative shadow-xl">
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-extrabold uppercase">
                    ONE-TIME PASS
                  </span>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-emerald-500/20">
                      <div>
                        <h3 className="font-extrabold text-emerald-300 text-base flex items-center gap-1.5">
                          <Ban className="w-4 h-4 text-emerald-400" />
                          Permanent No Ads
                        </h3>
                        <p className="text-[11px] text-zinc-400">100% Ad-Free Experience</p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-extrabold text-emerald-400">₱70</span>
                        <span className="text-[10px] text-zinc-400 block">one-time</span>
                      </div>
                    </div>

                    <ul className="space-y-2.5 text-xs text-zinc-200 font-medium">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span><strong>100% No Ads Guarantee</strong> (Permanently)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>No banner sponsors or popups</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Clean distraction-free interface</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Lifetime account badge</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={() => setShowCheckoutModal(true)}
                    className="w-full py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer mt-4"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span>Pay ₱70 (Permanent No Ads)</span>
                  </button>
                </div>

                {/* 3. VIP Gamer Pass Column */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-primary-950/40 to-black border border-primary-500/40 space-y-4 flex flex-col justify-between relative shadow-xl">
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-300 text-[9px] font-extrabold uppercase">
                    FULL UNLOCK
                  </span>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-primary-500/20">
                      <div>
                        <h3 className="font-extrabold text-primary-300 text-base flex items-center gap-1.5">
                          <Crown className="w-4 h-4 fill-primary-400 text-primary-400" />
                          VIP Gamer Pass
                        </h3>
                        <p className="text-[11px] text-zinc-400/80">Full Unlocked Ecosystem</p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-extrabold text-primary-400">₱99</span>
                        <span className="text-[10px] text-zinc-400 block">/ month</span>
                      </div>
                    </div>

                    <ul className="space-y-2 text-xs text-zinc-200 font-medium">
                      <li className="flex items-center gap-2">
                        <Zap className="w-3.5 h-3.5 text-primary-400 shrink-0" />
                        <span><strong>Unlimited Cloud Builds</strong></span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Zap className="w-3.5 h-3.5 text-primary-400 shrink-0" />
                        <span><strong>AI FPS Predictor</strong></span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Zap className="w-3.5 h-3.5 text-primary-400 shrink-0" />
                        <span><strong>Price Trend Graphs</strong></span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-primary-400 shrink-0" />
                        <span><strong>24/7 AI PC Consultant</strong></span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={handleSubscribeVip}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-black font-extrabold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer mt-4"
                  >
                    <Crown className="w-3.5 h-3.5 fill-black" />
                    <span>Subscribe VIP (₱99/mo)</span>
                  </button>
                </div>

              </div>

              {/* Interactive VIP Demo / Active Tools Section */}
              <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary-400" />
                    <span>{isVipOrAdFree ? "⚡ Your VIP Unlocked Tools (Click to Launch)" : "Test Drive VIP Feature Demos"}</span>
                    {isVipOrAdFree && (
                      <span className="px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-300 text-[10px] font-extrabold uppercase border border-primary-500/40">
                        UNLOCKED
                      </span>
                    )}
                  </h3>
                  <div className="flex gap-1.5 p-1 bg-[var(--app-bg)]/50 rounded-xl border border-white/10 overflow-x-auto scrollbar-hide">
                    <button
                      onClick={() => setActiveDemo('pro')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer shrink-0 ${
                        activeDemo === 'pro' ? 'bg-primary-500 text-black' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Pro Setup
                    </button>
                    <button
                      onClick={() => setActiveDemo('consultant')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer shrink-0 ${
                        activeDemo === 'consultant' ? 'bg-primary-500 text-black' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      AI PC Consultant
                    </button>
                    <button
                      onClick={() => setActiveDemo('export')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer shrink-0 ${
                        activeDemo === 'export' ? 'bg-primary-500 text-black' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Spec Exporter
                    </button>
                  </div>
                </div>

                {activeDemo === 'pro' && (
                  <div className="p-4 bg-[var(--app-bg)]/40 rounded-2xl border border-white/10 space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                      <div>
                        <h4 className="font-bold text-xs text-primary-300 uppercase tracking-wider">Valorant Pro Inspired Budget Loadout</h4>
                        <p className="text-xs text-zinc-400 mt-0.5">Optimized for high polling rates & low latency within ₱15,000 budget range.</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setShowModal(false);
                            onNavigateTab?.('preset');
                          }}
                          className="px-4 py-2 rounded-xl bg-primary-500 text-black font-extrabold text-xs hover:bg-primary-400 transition cursor-pointer flex items-center gap-1.5"
                        >
                          <span>Open Configurator</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-zinc-400">
                      <div className="p-2 bg-white/5 rounded-xl">🖱️ VXE R1 Pro (4K)</div>
                      <div className="p-2 bg-white/5 rounded-xl">⌨️ RK R65 Magnetic</div>
                      <div className="p-2 bg-white/5 rounded-xl">🎧 BlackShark V2 X</div>
                      <div className="p-2 bg-white/5 rounded-xl">🟩 Alpha Control Pad</div>
                    </div>
                  </div>
                )}

                {activeDemo === 'consultant' && (
                  <div className="p-4 bg-[var(--app-bg)]/40 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-xs text-primary-300 uppercase tracking-wider">AI PC Consultant & Builder Concierge</h4>
                      <p className="text-xs text-zinc-400 mt-0.5">Ask questions like "Will RX 6600 bottleneck Ryzen 5 5600 for CS2 at 1080p?"</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        onNavigateTab?.('ai');
                      }}
                      className="px-4 py-2 rounded-xl bg-primary-500 text-black font-extrabold text-xs hover:bg-primary-400 transition flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <Bot className="w-3.5 h-3.5" />
                      <span>Launch AI Concierge Tab</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {activeDemo === 'export' && (
                  <div className="p-4 bg-[var(--app-bg)]/40 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-xs text-primary-300 uppercase tracking-wider">High-Res Loadout PDF / Quote Sheet</h4>
                      <p className="text-xs text-zinc-400 mt-0.5">Generates official PH hardware specification sheet for clients & tournament organizers.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        onNavigateTab?.('builder');
                      }}
                      className="px-4 py-2 rounded-xl bg-primary-500 text-black font-extrabold text-xs hover:bg-primary-400 transition flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      <span>Launch Loadout & Spec Exporter</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition cursor-pointer"
                >
                  Close Proposal
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

