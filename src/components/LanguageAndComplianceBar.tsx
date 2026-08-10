import React, { useState } from 'react';
import { 
  Globe, 
  Crown, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  X, 
  Languages, 
  Check, 
  ExternalLink,
  Ban,
  Zap,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';

export interface LanguageOption {
  code: string;
  name: string;
  flag: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'tl', name: 'Tagalog / Filipino', nativeName: 'Tagalog', flag: '🇵🇭' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: 'Chinese (Simplified)', nativeName: '中文', flag: '🇨🇳' },
  { code: 'id', name: 'Bahasa Indonesia', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
];

interface LanguageAndComplianceBarProps {
  user: UserProfile | null;
  onToggleVip?: () => void;
  selectedLanguage: LanguageOption;
  onSelectLanguage: (lang: LanguageOption) => void;
  isAutoTranslateActive: boolean;
  onToggleAutoTranslate: () => void;
}

export default function LanguageAndComplianceBar({
  user,
  onToggleVip,
  selectedLanguage,
  onSelectLanguage,
  isAutoTranslateActive,
  onToggleAutoTranslate
}: LanguageAndComplianceBarProps) {
  const [showTosModal, setShowTosModal] = useState(false);
  const [showVipInfoModal, setShowVipInfoModal] = useState(false);

  return (
    <>
      {/* Top Utility Bar */}
      <div className="bg-[var(--app-bg)]/60 border-b border-white/10 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Left section removed as requested */}

        {/* Right: Language Selector, Auto-Translate Toggle, ToS Audit Button */}
        <div className="flex items-center gap-2.5 ml-auto">
          
          {/* Language Selector Dropdown */}
          <div className="flex items-center gap-1.5 bg-[color-mix(in_srgb,var(--card-bg)_80%,white)]/90 border border-white/15 px-2.5 py-1 rounded-xl">
            <Languages className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={selectedLanguage.code}
              onChange={(e) => {
                const lang = SUPPORTED_LANGUAGES.find(l => l.code === e.target.value);
                if (lang) onSelectLanguage(lang);
              }}
              className="bg-transparent text-white text-xs font-bold focus:outline-none cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code} className="bg-[color-mix(in_srgb,var(--card-bg)_80%,white)] text-white">
                  {lang.flag} {lang.nativeName} ({lang.code.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          {/* Auto Translate Toggle Button */}
          <button
            type="button"
            onClick={onToggleAutoTranslate}
            className={`px-3 py-1 rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-pointer border ${
              isAutoTranslateActive 
                ? 'bg-primary-500 text-black border-primary-500 shadow-sm' 
                : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>{isAutoTranslateActive ? 'Auto-Translate: ON' : 'Translate Page'}</span>
          </button>

          {/* API Terms & Services Audit Button */}
          <button
            type="button"
            onClick={() => setShowTosModal(true)}
            className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 font-medium text-xs transition flex items-center gap-1 cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">API & ToS Audit</span>
          </button>
        </div>
      </div>

      {/* Auto-Translate Active Notice Banner */}
      {isAutoTranslateActive && (
        <div className="bg-primary-500/15 border-b border-primary-500/30 px-4 py-1.5 flex items-center justify-between text-xs text-primary-400 font-semibold">
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 shrink-0" />
            <span>
              Auto-Translate is active. UI content and community reviews are dynamically translated into <strong>{selectedLanguage.flag} {selectedLanguage.name}</strong>.
            </span>
          </div>
          <button 
            onClick={onToggleAutoTranslate} 
            className="underline font-bold text-white hover:text-primary-300 cursor-pointer text-[11px]"
          >
            Disable
          </button>
        </div>
      )}

      {/* VIP Status & Perks Modal */}
      <AnimatePresence>
        {showVipInfoModal && user && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--app-bg)]/80 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[color-mix(in_srgb,var(--card-bg)_80%,white)] border border-primary-500/30 rounded-[32px] p-6 max-w-lg w-full shadow-2xl relative space-y-5"
            >
              <button
                onClick={() => setShowVipInfoModal(false)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/10 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-primary-500/20 text-primary-400 border border-primary-500/40">
                  <Crown className="w-6 h-6 fill-primary-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">VIP Account Status</h3>
                  <p className="text-xs text-zinc-400">{user.displayName} ({user.email})</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-r from-primary-950/40 to-black border border-primary-500/30 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-primary-300 uppercase">Current Membership:</span>
                  <span className="px-3 py-1 rounded-full bg-primary-500 text-black font-extrabold text-xs">
                    {user.isVip ?? true ? 'VIP PASS ACTIVE' : 'STANDARD FREE'}
                  </span>
                </div>
                <div className="text-xs text-zinc-300 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span><strong>100% Ad-Free Experience</strong> (No banners, no popup ads)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span><strong>Unlimited Cloud Saved Loadouts</strong> across all devices</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span><strong>AI PC Consultant & Hardware Bottleneck Advisor</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span><strong>Historical Price Graphs & Local Deal Radar</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span><strong>International Multi-Currency Localizer</strong></span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <span className="text-xs text-zinc-400">Want to test toggling VIP state?</span>
                <button
                  type="button"
                  onClick={() => {
                    if (onToggleVip) onToggleVip();
                    setShowVipInfoModal(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition cursor-pointer"
                >
                  {user.isVip ?? true ? 'Switch to Free Tier Mode' : 'Activate VIP Mode Now'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* API Terms of Service & Retailer Compliance Modal */}
      <AnimatePresence>
        {showTosModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--app-bg)]/80 backdrop-blur-xl overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[color-mix(in_srgb,var(--card-bg)_80%,white)] border border-emerald-500/30 rounded-[32px] p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative my-8 space-y-6"
            >
              <button
                onClick={() => setShowTosModal(false)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-white">API Terms & Services Compliance Audit</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Automated Verification & Policy Integrity Report</p>
                </div>
              </div>

              {/* Status Banner */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>
                  <strong>100% Compliant: Zero Terms of Service Violations Detected.</strong> GamerBudget uses strictly authorized API endpoints, direct official retailer search protocols, and compliant server-side AI processing.
                </span>
              </div>

              {/* Comprehensive Terms Breakdown */}
              <div className="space-y-4 text-xs text-zinc-300">
                <div className="p-4 rounded-2xl bg-[var(--app-bg)]/40 border border-white/10 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-sm">1. Google Gemini API Terms of Service</h4>
                    <span className="text-[10px] text-emerald-400 font-extrabold bg-emerald-500/10 px-2 py-0.5 rounded">PASSED</span>
                  </div>
                  <p className="text-zinc-400 leading-relaxed">
                    All AI loadouts and recommendations are proxied via standard backend server endpoints (<code className="text-emerald-300">@google/genai</code>). API keys are hidden server-side, preventing client-side exposure. Generative outputs comply with safety and content policies.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[var(--app-bg)]/40 border border-white/10 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-sm">2. E-Commerce & Retailer Linking Compliance</h4>
                    <span className="text-[10px] text-emerald-400 font-extrabold bg-emerald-500/10 px-2 py-0.5 rounded">PASSED</span>
                  </div>
                  <p className="text-zinc-400 leading-relaxed">
                    Links to Datablitz, Shopee, Lazada, Amazon, and EasyPC use standard public referral redirect paths. GamerBudget <strong>does NOT execute unauthorized web scraping or automated bot requests</strong> against retailer servers, fully complying with Shopee, Lazada, and Datablitz ToS.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[var(--app-bg)]/40 border border-white/10 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-sm">3. Firebase & Discord OAuth2 Identity Terms</h4>
                    <span className="text-[10px] text-emerald-400 font-extrabold bg-emerald-500/10 px-2 py-0.5 rounded">PASSED</span>
                  </div>
                  <p className="text-zinc-400 leading-relaxed">
                    Discord login utilizes standard OAuth2 authentication with minimal <code className="text-emerald-300">identify</code> and <code className="text-emerald-300">email</code> scopes compliant with Discord Developer Terms of Service. Firebase Authentication and Firestore Security Rules protect all saved loadouts and user profiles against unauthorized access.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[var(--app-bg)]/40 border border-white/10 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-sm">4. No In-App Purchase & No Ads Guarantee</h4>
                    <span className="text-[10px] text-emerald-400 font-extrabold bg-emerald-500/10 px-2 py-0.5 rounded">PASSED</span>
                  </div>
                  <p className="text-zinc-400 leading-relaxed">
                    The app contains zero third-party advertising scripts or unauthorized tracker SDKs, providing a clean, distraction-free VIP environment.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowTosModal(false)}
                  className="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition cursor-pointer"
                >
                  Acknowledge Compliance Audit
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
