import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, User, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';

export const DEFAULT_AVATARS = [
  {
    id: 'cyberbot',
    name: 'Cyber Bot',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=CyberBotPH'
  },
  {
    id: 'shadowninja',
    name: 'Shadow Ninja',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=ShadowNinjaPH'
  },
  {
    id: 'mechamech',
    name: 'Mecha Mech',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=MechaMechPH'
  },
  {
    id: 'pixelknight',
    name: 'Pixel Knight',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=PixelKnightPH'
  },
  {
    id: 'astragamer',
    name: 'Astra Gamer',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=AstraGamerPH'
  },
  {
    id: 'neonviper',
    name: 'Neon Viper',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=NeonViperPH'
  },
  {
    id: 'valkyrieapex',
    name: 'Valkyrie Apex',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=ValkyrieApexPH'
  },
  {
    id: 'titanlord',
    name: 'Titan Lord',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=TitanLordPH'
  }
];

interface AvatarChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSelectAvatar: (photoURL: string, avatarName: string) => void;
}

export default function AvatarChoiceModal({ isOpen, onClose, currentUser, onSelectAvatar }: AvatarChoiceModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[var(--app-bg)]/80 backdrop-blur-xl overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-[var(--card-bg)] border border-primary-500/40 rounded-[28px] sm:rounded-[32px] p-5 sm:p-7 max-w-lg w-full shadow-2xl relative my-6 overflow-hidden space-y-6"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 text-zinc-400 hover:text-white transition cursor-pointer"
            title="Close Avatar Picker"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-primary-500/20 text-primary-400 border border-primary-500/40">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>Choose Your Gamer Avatar</span>
                <span className="px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-300 text-[10px] font-extrabold uppercase border border-primary-500/40">8 Choices</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">Select from 8 official GearForge gamer avatars</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
            <img
              src={currentUser.photoURL || DEFAULT_AVATARS[0].url}
              alt="Current Avatar"
              className="w-12 h-12 rounded-full border-2 border-primary-400/80 shadow-md shrink-0"
            />
            <div className="space-y-0.5">
              <span className="text-[10px] text-zinc-400 uppercase font-extrabold tracking-wider block">Current Profile Avatar</span>
              <span className="text-sm font-bold text-white block truncate">{currentUser.displayName}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {DEFAULT_AVATARS.map((avatar) => {
              const isSelected = currentUser.photoURL === avatar.url;
              return (
                <button
                  key={avatar.id}
                  type="button"
                  onClick={() => {
                    onSelectAvatar(avatar.url, avatar.name);
                    onClose();
                  }}
                  className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-between gap-2.5 transition cursor-pointer group relative overflow-hidden ${
                    isSelected
                      ? 'bg-primary-500/25 border-primary-400 shadow-lg shadow-primary-500/20 scale-102'
                      : 'bg-[color-mix(in_srgb,var(--card-bg)_80%,white)] border-white/10 hover:bg-white/10 hover:border-primary-500/40'
                  }`}
                >
                  {isSelected && (
                    <span className="absolute top-1.5 right-1.5 p-0.5 bg-primary-500 rounded-full text-black">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                  <div className="relative">
                    <img
                      src={avatar.url}
                      alt={avatar.name}
                      className="w-14 h-14 rounded-full border border-primary-500/30 group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className={`text-xs font-bold leading-tight ${isSelected ? 'text-primary-300' : 'text-zinc-300 group-hover:text-white'}`}>
                    {avatar.name}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 flex justify-between items-center text-xs text-zinc-400 border-t border-white/10">
            <span className="flex items-center gap-1 text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-primary-400" />
              <span>Click any avatar to apply immediately</span>
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
