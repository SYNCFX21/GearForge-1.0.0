import React, { useState, useEffect, useRef } from 'react';
import BudgetCalculator from './components/BudgetCalculator';
import CustomLoadoutPlanner from './components/CustomLoadoutPlanner';
import CompareAccessories from './components/CompareAccessories';
import LocalStoresDirectory from './components/LocalStoresDirectory';
import QuickCatalog from './components/QuickCatalog';
import PremiumFeaturesProposal from './components/PremiumFeaturesProposal';
import AIBudgetBuilder from './components/AIBudgetBuilder';
import PriceHistoryGraph from './components/PriceHistoryGraph';
import ItemReviewForum from './components/ItemReviewForum';
import AdminPanelModal from './components/AdminPanelModal';
import LanguageAndComplianceBar, { SUPPORTED_LANGUAGES, LanguageOption } from './components/LanguageAndComplianceBar';
import { SavedLoadout, Accessory, UserProfile } from './types';
import AuthGate from './components/AuthGate';
import AvatarChoiceModal from './components/AvatarChoiceModal';
import UserSearch from './components/UserSearch';
import UserProfileModal from './components/UserProfileModal';
import RulesModal from './components/RulesModal';
import PCBuilder from './components/PCBuilder';
import ThreeBackground, { BACKGROUND_THEMES } from './components/ThreeBackground';
import ThemeEditorModal, { CustomTheme } from './components/ThemeEditorModal';
import { 
  Gamepad2, 
  Coins, 
  Sparkles, 
  Sliders, 
  Layers,
  Heart, 
  Trash2, 
  Check, 
  Store, 
  LogOut,
  Cpu,
  Monitor,
  TrendingDown,
  MessageSquare,
  Crown,
  Globe,
  Palette,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  Grid,
  X,
  ArrowRight,
  Menu,
  Ban,
  Clock,
  ShieldCheck,
  AlertTriangle,
  User,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'preset' | 'pcbuild' | 'builder' | 'price' | 'forum' | 'ai' | 'catalog' | 'compare' | 'directory'>('preset');
  const [savedLoadouts, setSavedLoadouts] = useState<SavedLoadout[]>([]);
  const [showNotification, setShowNotification] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [selectedSearchUser, setSelectedSearchUser] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption>(SUPPORTED_LANGUAGES[0]);
  const [isAutoTranslateActive, setIsAutoTranslateActive] = useState<boolean>(false);
  const [showSectionsGridModal, setShowSectionsGridModal] = useState<boolean>(false);
  const [isHamburgerOpen, setIsHamburgerOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState<boolean>(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState<boolean>(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState<boolean>(false);
  const [activeThemeId, setActiveThemeId] = useState<string>(() => localStorage.getItem("gf_active_theme_id") || "classic_cyan");
  const [customThemes, setCustomThemes] = useState<CustomTheme[]>(() => {
    try {
      const saved = localStorage.getItem("gf_custom_themes");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isThemeEditorOpen, setIsThemeEditorOpen] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => localStorage.getItem("gf_dark_mode") !== "false");
  useEffect(() => { localStorage.setItem("gf_dark_mode", isDarkMode.toString()); }, [isDarkMode]);

  const tabsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    // Set theme color
    // Find the theme from BACKGROUND_THEMES imported from ThreeBackground
    const theme = [...BACKGROUND_THEMES, ...customThemes].find(t => t.id === activeThemeId) || BACKGROUND_THEMES[0];
    document.documentElement.style.setProperty('--theme-color', theme.color);
    document.documentElement.style.setProperty('--app-bg', isDarkMode ? (theme.bgColor || '#050505') : '#f5f5f7');
    document.documentElement.style.setProperty('--card-bg', isDarkMode ? (theme.cardColor || '#09090b') : '#ffffff');
    document.documentElement.style.setProperty('--text-main', isDarkMode ? ((theme as any).textColor || '#ffffff') : '#1d1d1f');
    
    if (isDarkMode) {
      document.body.classList.remove('light-mode-active');
    } else {
      document.body.classList.add('light-mode-active');
    }
  }, [activeThemeId, customThemes, isDarkMode]);


  const handleScrollTabs = (direction: 'left' | 'right') => {
    if (tabsContainerRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      tabsContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Toggle or update user state
  const handleUpdateUser = async (updatedUser: UserProfile, msg?: string) => {
    setUser(updatedUser);
    localStorage.setItem('ph_gamer_user', JSON.stringify(updatedUser));
    if (updatedUser.email) {
      localStorage.setItem(`gf_user_${updatedUser.email.toLowerCase().trim()}`, JSON.stringify(updatedUser));
    }
    try {
      const { saveUserProfileToGearForgeDB } = await import('./lib/firestore');
      await saveUserProfileToGearForgeDB(updatedUser.uid, updatedUser);
    } catch (err) {
      console.warn("Failed to persist user update to Firestore:", err);
    }
    if (msg) {
      triggerNotification(msg);
    }
  };

  const handleToggleVip = () => {
    if (!user) return;
    const updatedUser: UserProfile = {
      ...user,
      isVip: !user.isVip,
      isTrialActive: false,
      vipTierName: !user.isVip ? 'VIP Gamer Pass' : undefined
    };
    handleUpdateUser(updatedUser, updatedUser.isVip ? "VIP Status Activated! Enjoy all premium perks." : "Switched to Free Tier.");
  };

  // Load user session and saved loadouts on mount
  useEffect(() => {
    let unsubscribeAuth: (() => void) | undefined;

    const initFirebase = async () => {
      try {
        const { auth } = await import('./lib/firebase');
        const { onAuthStateChanged } = await import('firebase/auth');
        const { getLoadoutsFromFirestore } = await import('./lib/firestore');

        unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
              const { getUserProfileFromFirestore } = await import('./lib/firestore');
              let loggedUser: UserProfile = {
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Gamer',
                photoURL: firebaseUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${firebaseUser.uid}`,
                providerId: 'firebase',
                registeredAt: firebaseUser.metadata.creationTime ? new Date(firebaseUser.metadata.creationTime).toLocaleDateString('en-PH') : new Date().toLocaleDateString('en-PH'),
                isVip: true, // Account default VIP status granted
                vipTierName: 'VIP Gamer Pass'
              };
              
              const fsProfile = await getUserProfileFromFirestore(firebaseUser.uid);
              if (fsProfile) {
                loggedUser = { ...loggedUser, ...fsProfile };
              }

              if (loggedUser.email && loggedUser.email.toLowerCase() === 'aaronsalagubang21@gmail.com') {
                loggedUser.role = 'super_admin';
                loggedUser.displayName = 'Aaron Lanceta';
                if (!fsProfile || fsProfile.role !== 'super_admin' || fsProfile.displayName !== 'Aaron Lanceta') {
                  const { saveUserProfileToGearForgeDB } = await import('./lib/firestore');
                  saveUserProfileToGearForgeDB(firebaseUser.uid, loggedUser).catch(console.warn);
                }
              } else if (loggedUser.role === 'super_admin') {
                loggedUser.role = 'user';
                const { saveUserProfileToGearForgeDB } = await import('./lib/firestore');
                saveUserProfileToGearForgeDB(firebaseUser.uid, loggedUser).catch(console.warn);
              }

              setUser(loggedUser);
              localStorage.setItem('ph_gamer_user', JSON.stringify(loggedUser));

            try {
              const fsLoadouts = await getLoadoutsFromFirestore(firebaseUser.uid);
              setSavedLoadouts(fsLoadouts);
            } catch (err) {
              console.error("Failed to fetch loadouts from Firestore:", err);
            }
          } else {
            setUser(null);
            localStorage.removeItem('ph_gamer_user');
            setSavedLoadouts([]);
          }
        });
      } catch (err) {
        console.error("Firebase init failed:", err);
      }
    };

    initFirebase();

    return () => {
      if (unsubscribeAuth) unsubscribeAuth();
    };
  }, []);

  // Save a new loadout
  const handleSaveLoadout = async (name: string, budget: number, playstyle: string, items: Accessory[]) => {
    const newLoadout: SavedLoadout = {
      id: `loadout-${Date.now()}`,
      name,
      budget,
      playstyle,
      accessories: items,
      createdAt: new Date().toISOString(), // Use ISO string for proper sorting
      notes: ''
    };

    const updated = [newLoadout, ...savedLoadouts];
    setSavedLoadouts(updated);
    
    if (user) {
      try {
        const { saveLoadoutToFirestore } = await import('./lib/firestore');
        await saveLoadoutToFirestore(user.uid, newLoadout);
      } catch (err) {
        console.error("Failed to save loadout to Firestore:", err);
      }
    }
    triggerNotification(`Successfully saved loadout: "${name}"!`);
  };

  // Delete a saved loadout
  const handleDeleteLoadout = async (id: string) => {
    const updated = savedLoadouts.filter(l => l.id !== id);
    setSavedLoadouts(updated);
    
    if (user) {
      try {
        const { deleteLoadoutFromFirestore } = await import('./lib/firestore');
        await deleteLoadoutFromFirestore(user.uid, id);
      } catch (err) {
        console.error("Failed to delete loadout from Firestore:", err);
      }
    }
    triggerNotification("Loadout deleted.");
  };

  const triggerNotification = (message: string) => {
    setShowNotification(message);
    setTimeout(() => {
      setShowNotification(null);
    }, 4000);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(val);
  };

  // Permanently delete user account & clean Firestore / localStorage
  const handlePermanentDeleteAccount = async () => {
    if (!user) return;
    setIsDeletingAccount(true);
    try {
      // 1. Delete Firestore user record and subcollections
      const { deleteUserProfileFromGearForgeDB } = await import('./lib/firestore');
      await deleteUserProfileFromGearForgeDB(user.uid);

      // 2. Delete Firebase Auth user if present
      const { auth } = await import('./lib/firebase');
      if (auth.currentUser) {
        await auth.currentUser.delete().catch((e) => {
          console.warn("Firebase Auth deletion warning:", e);
        });
      }
    } catch (e) {
      console.error("Account deletion error:", e);
    } finally {
      // 3. Clear local storage records
      localStorage.removeItem('ph_gamer_user');
      if (user.email) {
        localStorage.removeItem(`gf_user_${user.email.toLowerCase().trim()}`);
      }
      setUser(null);
      setIsDeletingAccount(false);
      setIsDeleteModalOpen(false);
      triggerNotification("🗑️ Your account and all associated data have been permanently deleted.");
    }
  };

  const handleAcceptRules = async () => {
    if (!user) return;
    const updatedUser = { ...user, hasAcceptedRules: true };
    await handleUpdateUser(updatedUser, "Welcome to the GearForge Forum!");
  };

  const handleDeclineRules = async () => {
    if (!user) return;
    try {
      const { auth } = await import('./lib/firebase');
      await auth.signOut();
    } catch (e) {
      console.warn("Sign out err:", e);
    }
    setUser(null);
    localStorage.removeItem('ph_gamer_user');
    triggerNotification("You must accept the rules to use GearForge.");
  };

  if (!user) {
    return <AuthGate onLoginSuccess={(loggedInUser) => setUser(loggedInUser)} />;
  }

  if (user.isBanned) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[var(--card-bg)]">
        <div className="max-w-md w-full bg-red-950/20 border border-red-500/40 p-8 rounded-[32px] shadow-2xl text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center border border-red-500/40">
            <Trash2 className="w-8 h-8 text-red-500" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-white">Account Banned</h1>
            <p className="text-sm text-red-300">
              Your account has been permanently banned for violating our community guidelines.
            </p>
          </div>
          <button
            onClick={async () => {
              try {
                const { auth } = await import('./lib/firebase');
                await auth.signOut();
              } catch (e) {
                console.error('Sign out error:', e);
              }
              localStorage.removeItem('ph_gamer_user');
              setUser(null);
            }}
            className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-extrabold transition shadow-lg shadow-red-600/30 w-full"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  if (user.isSuspended) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--card-bg)] relative overflow-hidden">
        {/* Suspended Navbar */}
        <header className="bg-primary-500/20 border-b border-primary-500/40 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-primary-400">
            <AlertTriangle className="w-6 h-6" />
            <span className="font-black text-lg">Account Suspended</span>
          </div>
          <button
            onClick={async () => {
              try {
                const { auth } = await import('./lib/firebase');
                await auth.signOut();
              } catch (e) {
                console.error('Sign out error:', e);
              }
              localStorage.removeItem('ph_gamer_user');
              setUser(null);
            }}
            className="px-4 py-2 bg-[var(--app-bg)]/40 hover:bg-[var(--app-bg)]/60 text-white text-xs font-bold rounded-xl border border-white/10 transition"
          >
            Sign Out
          </button>
        </header>

        {/* Content area that is locked out */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[var(--app-bg)]/40 border border-primary-500/30 p-8 rounded-[32px] shadow-2xl text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center border border-primary-500/40">
              <Clock className="w-8 h-8 text-primary-500" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-black text-white">Temporary Suspension</h2>
              <p className="text-sm text-zinc-300">
                Your account is currently suspended and can be accessed again after:
              </p>
              <div className="text-lg font-mono font-extrabold text-primary-400 pt-2">
                {user.suspendedUntil || 'Unknown Date'}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Compute effective trial expiration and active VIP/Ad-Free status
  const isTrialExpired = Boolean(
    user.isTrialActive && 
    user.trialEndsAt && 
    new Date(user.trialEndsAt).getTime() < Date.now()
  );

  const hasActiveVip = Boolean((user.isVip && (!user.isTrialActive || !isTrialExpired)) || user.role === 'super_admin' || user.role === 'admin');
  const hasAdFree = Boolean(user.hasPermanentAdFree || hasActiveVip || user.role === 'super_admin' || user.role === 'admin');

  return (
    <div className="min-h-screen text-[#f5f5f7] antialiased selection:bg-primary-500 selection:text-black pb-16 relative overflow-hidden">
      <ThreeBackground />
      
      {/* Top International Language Bar & Compliance Audit */}
      <LanguageAndComplianceBar
        user={user}
        onToggleVip={handleToggleVip}
        selectedLanguage={selectedLanguage}
        onSelectLanguage={setSelectedLanguage}
        isAutoTranslateActive={isAutoTranslateActive}
        onToggleAutoTranslate={() => setIsAutoTranslateActive(!isAutoTranslateActive)}
      />


      {/* Toast Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-12 left-1/2 -translate-x-1/2 z-50 bg-[var(--color-glass)] backdrop-blur-2xl px-5 py-3 rounded-2xl shadow-2xl border border-[var(--color-glass-border)] flex items-center gap-3 text-sm font-semibold"
          >
            <div className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center">
              <Check className="w-3.5 h-3.5 text-primary-400" />
            </div>
            <span>{showNotification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-6 sm:space-y-8 relative z-10">
        
        {/* Apple/Gamer Hybrid Header */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6 pb-6 border-b border-[var(--color-glass-border)]">
          <div className="flex items-center justify-between w-full lg:w-auto">
            <div className="flex items-center gap-3 sm:gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-none">
                    Gear<span className="text-primary-400">Forge</span>
                  </h1>
                </div>
              </div>
            </div>

            {/* Hamburger Menu Toggle Button - Top Right on Mobile */}
            <button
              onClick={() => setIsHamburgerOpen(true)}
              className="lg:hidden flex items-center gap-2 p-2.5 sm:p-3 bg-primary-500/20 hover:bg-primary-500/30 backdrop-blur-2xl border border-primary-500/50 hover:border-primary-400 rounded-2xl shrink-0 shadow-xl text-white cursor-pointer transition active:scale-95 group"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5 text-primary-400 group-hover:rotate-90 transition-transform duration-300" />
              <span className="font-extrabold text-xs tracking-wider uppercase text-primary-300">
                Menu
              </span>
            </button>
          </div>

          <div className="flex-1 flex justify-center w-full px-0 lg:px-6 order-last lg:order-none mt-4 lg:mt-0">
            <UserSearch onUserSelect={(username) => setSelectedSearchUser(username)} />
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {/* Authenticated User Profile with Dynamic Badge */}
            <div className="flex items-center justify-between gap-3 bg-[var(--color-glass)] backdrop-blur-2xl border border-[var(--color-glass-border)] p-3 sm:p-4 rounded-2xl sm:rounded-3xl shrink-0 shadow-xl relative overflow-hidden">
              <div className="flex items-center gap-3">
                <div 
                  className="relative cursor-pointer group" 
                  onClick={() => setIsAvatarModalOpen(true)}
                  title="Click to Change Avatar (8 Presets)"
                >
                  <img
                    src={user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.displayName}`}
                    alt="Avatar"
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-primary-400/50 group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute -bottom-1 -right-1 p-0.5 bg-primary-500 rounded-full text-black" title="Account Status">
                    <Crown className="w-2.5 h-2.5 fill-black" />
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => setSelectedSearchUser(user.displayName)}
                      className="text-xs font-bold text-white block truncate max-w-[100px] sm:max-w-[120px] hover:text-primary-400 transition cursor-pointer text-left"
                      title="View My Profile"
                    >
                      {user.displayName}
                    </button>
                    {user.role === 'super_admin' ? (
                      <span className="px-1.5 py-0.2 rounded bg-primary-500/20 text-primary-300 text-[9px] font-extrabold uppercase border border-primary-500/40">Super Admin</span>
                    ) : user.role === 'admin' ? (
                      <span className="px-1.5 py-0.2 rounded bg-primary-500/20 text-primary-300 text-[9px] font-extrabold uppercase border border-primary-500/40">Admin</span>
                    ) : user.isTrialActive && !isTrialExpired ? (
                      <span className="px-1.5 py-0.2 rounded bg-primary-500/20 text-primary-300 text-[9px] font-extrabold uppercase">7-Day Trial</span>
                    ) : isTrialExpired ? (
                      <span className="px-1.5 py-0.2 rounded bg-red-500/20 text-red-300 text-[9px] font-extrabold uppercase border border-red-500/40">Trial Expired</span>
                    ) : user.hasPermanentAdFree ? (
                      <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-extrabold uppercase">Ad-Free</span>
                    ) : hasActiveVip ? (
                      <span className="px-1.5 py-0.2 rounded bg-primary-500/20 text-primary-300 text-[9px] font-extrabold uppercase">VIP Member</span>
                    ) : (
                      <span className="px-1.5 py-0.2 rounded bg-white/10 text-zinc-300 text-[9px] font-extrabold uppercase">Basic Tier</span>
                    )}
                  </div>
                  <button
                    onClick={() => setIsAvatarModalOpen(true)}
                    className="text-[10px] font-bold text-primary-400 hover:underline block text-left cursor-pointer"
                  >
                    Change Avatar (8 Presets)
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={async () => {
                    try {
                      const { auth } = await import('./lib/firebase');
                      await auth.signOut();
                    } catch (e) {
                      console.error('Sign out error:', e);
                    }
                    localStorage.removeItem('ph_gamer_user');
                    setUser(null);
                    triggerNotification("Signed out successfully.");
                  }}
                  className="p-2 sm:p-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="p-2 sm:p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl transition-colors cursor-pointer"
                  title="Delete Account Permanently"
                >
                  <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>

            {/* Hamburger Menu Toggle Button - Far Right on PC / Desktop */}
            <button
              onClick={() => setIsHamburgerOpen(true)}
              className="hidden lg:flex items-center gap-2.5 p-3.5 bg-primary-500/20 hover:bg-primary-500/30 backdrop-blur-2xl border border-primary-500/50 hover:border-primary-400 rounded-2xl shrink-0 shadow-xl text-white cursor-pointer transition active:scale-95 group"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5 text-primary-400 group-hover:rotate-90 transition-transform duration-300" />
              <span className="font-extrabold text-xs tracking-wider uppercase text-primary-300">
                Menu
              </span>
            </button>
          </div>
        </header>

        {/* Basic User Sponsor Ad Banner (Hidden if VIP or Permanent Ad-Free) */}
        {!hasAdFree && (
          <div className="bg-gradient-to-r from-[var(--card-bg)] via-primary-500/10 to-[var(--card-bg)] border border-primary-500/30 p-3.5 sm:p-4 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-3 text-xs my-2">
            <div className="flex items-center gap-2.5 text-center md:text-left">
              <span className="px-2 py-0.5 rounded bg-primary-500/20 text-primary-300 font-extrabold uppercase text-[10px] border border-primary-500/40 shrink-0">
                Sponsor Deals
              </span>
              <p className="text-zinc-300 font-medium">
                🔥 <strong className="text-white">Razer, VXE & Royal Kludge PH Flash Deals</strong> — Up to 30% off on Datablitz & EasyPC.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  const trialUser: UserProfile = {
                    ...user,
                    isVip: true,
                    isTrialActive: true,
                    vipTierName: '7-Day VIP Free Trial',
                    trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
                  };
                  handleUpdateUser(trialUser, "🎉 7-Day VIP Free Trial Activated! Enjoy full AI features & 0 ads.");
                }}
                className="px-3 py-1.5 rounded-xl bg-primary-500/20 hover:bg-primary-500/30 text-primary-300 border border-primary-500/40 font-extrabold text-[11px] cursor-pointer transition flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-primary-400" />
                <span>7-Day Free Trial</span>
              </button>
              <button
                onClick={() => {
                  const adFreeUser: UserProfile = {
                    ...user,
                    hasPermanentAdFree: true,
                    vipTierName: user.isVip ? user.vipTierName : 'Permanent Ad-Free'
                  };
                  handleUpdateUser(adFreeUser, "⚡ Permanent Ad-Free Status Unlocked for ₱70! Ads permanently disabled.");
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-extrabold text-[11px] cursor-pointer transition flex items-center gap-1"
              >
                <Crown className="w-3.5 h-3.5 text-emerald-400" />
                <span>Remove Ads (₱70 Permanent)</span>
              </button>
            </div>
          </div>
        )}

        {/* Saved Loadouts Section */}
        {savedLoadouts.length > 0 && (
          <div className="bg-[var(--color-glass)] backdrop-blur-2xl border border-[var(--color-glass-border)] p-4 sm:p-6 rounded-2xl sm:rounded-[32px] space-y-4 shadow-2xl">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-[var(--color-brand-red)] fill-[var(--color-brand-red)] shrink-0 animate-pulse" />
              <h2 className="font-bold text-sm text-white uppercase tracking-widest">Your Saved Setups ({savedLoadouts.length})</h2>
            </div>
            <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-hide touch-pan-x">
              {savedLoadouts.map((loadout) => {
                const totalCost = loadout.accessories.reduce((acc, item) => acc + item.pricePhp, 0);
                return (
                  <div
                    key={loadout.id}
                    className="p-4 sm:p-5 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between gap-6 shrink-0 min-w-[260px] sm:min-w-[300px] hover:bg-white/10 transition-colors"
                  >
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-white leading-tight">{loadout.name}</h3>
                      <p className="text-xs text-zinc-400 mt-1 font-medium">{loadout.playstyle}</p>
                      <p className="text-xs sm:text-sm font-bold text-primary-400 mt-2">{formatCurrency(totalCost)}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteLoadout(loadout.id)}
                      className="p-2 sm:p-2.5 bg-white/5 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 rounded-full transition-colors cursor-pointer"
                      title="Delete Loadout"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Premium Features Proposal Banner */}
        {user?.role !== 'super_admin' && (
          <PremiumFeaturesProposal 
            user={user} 
            onUpdateUser={handleUpdateUser} 
            onNavigateTab={(tabId) => setActiveTab(tabId as any)} 
          />
        )}

        {/* Enhanced Phone & Tablet Navigation Control with Scroll Arrows & Grid Selector */}
        <div className="space-y-2">
          {/* Mobile Scroll Hint & Quick Action Bar */}
          <div className="flex items-center justify-between text-xs text-zinc-400 px-1 sm:hidden">
            <span className="flex items-center gap-1 font-medium text-[11px] text-primary-300/90">
              <Sparkles className="w-3 h-3 text-primary-400" />
              Swipe or tap arrows to view all 8 features:
            </span>
            <button
              onClick={() => setShowSectionsGridModal(true)}
              className="text-[11px] font-extrabold text-primary-400 underline flex items-center gap-1 cursor-pointer"
            >
              <Grid className="w-3 h-3" />
              <span>View All 8 Sections</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 bg-[var(--color-glass)] backdrop-blur-2xl p-1.5 sm:p-2 rounded-2xl border border-[var(--color-glass-border)] shadow-xl w-full relative">
            {/* Left Scroll Arrow */}
            <button
              onClick={() => handleScrollTabs('left')}
              className="p-2 sm:p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition shrink-0 cursor-pointer active:scale-95"
              title="Scroll Tabs Left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Scrollable Tab Bar */}
            <div
              ref={tabsContainerRef}
              className="flex overflow-x-auto gap-2 scrollbar-hide touch-pan-x scroll-smooth flex-1 py-0.5"
            >
              {[
                { id: 'preset', icon: Sliders, label: 'Configurator', isVipFeature: false },
                { id: 'pcbuild', icon: Monitor, label: 'PC Builder', isVipFeature: false },
                { id: 'builder', icon: Cpu, label: 'AI FPS Builder', isVipFeature: true },
                { id: 'price', icon: TrendingDown, label: 'Price History', isVipFeature: true },
                { id: 'forum', icon: MessageSquare, label: 'Item Review Forum', isVipFeature: false },
                { id: 'ai', icon: Sparkles, label: 'AI Concierge', isVipFeature: true },
                { id: 'catalog', icon: Layers, label: 'Gear Catalog', isVipFeature: false },
                { id: 'compare', icon: Sliders, label: 'Compare', isVipFeature: false },
                { id: 'directory', icon: Store, label: 'Stores', isVipFeature: false },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 py-2.5 px-3.5 sm:px-4 rounded-xl font-semibold text-xs transition-all shrink-0 cursor-pointer whitespace-nowrap relative ${
                      isActive
                        ? 'bg-[var(--theme-color)] text-white shadow-lg shadow-[var(--theme-color)]/30 scale-102 border border-primary-400/40'
                        : tab.isVipFeature
                        ? 'text-primary-300 hover:text-white bg-primary-500/10 hover:bg-primary-500/20 border border-primary-500/30'
                        : 'text-zinc-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive && (tab.id === 'builder' || tab.id === 'ai') ? 'text-primary-400' : tab.isVipFeature ? 'text-primary-400' : ''}`} />
                    <span>{tab.label}</span>
                    {tab.isVipFeature && (
                      <div className="flex items-center gap-1">
                        {!hasActiveVip && <Lock className="w-3 h-3 text-primary-500" />}
                        <span className="px-1 py-0.2 rounded bg-primary-500/30 text-primary-300 text-[9px] font-extrabold uppercase border border-primary-400/40">
                          VIP
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right Scroll Arrow */}
            <button
              onClick={() => handleScrollTabs('right')}
              className="p-2 sm:p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition shrink-0 cursor-pointer active:scale-95"
              title="Scroll Tabs Right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* All Sections Grid Button for Mobile & Tablet */}
            <button
              onClick={() => setShowSectionsGridModal(true)}
              className="flex items-center gap-1.5 py-2.5 px-3 rounded-xl bg-primary-500/20 hover:bg-primary-500/30 border border-primary-500/40 text-primary-300 font-extrabold text-xs shrink-0 cursor-pointer transition shadow-sm active:scale-95"
              title="Open All App Sections Menu"
            >
              <Grid className="w-4 h-4 text-primary-400" />
              <span className="hidden md:inline">All Sections</span>
            </button>
          </div>
        </div>

        {/* Mobile & Tablet All Sections Grid Modal */}
        <AnimatePresence>
          {showSectionsGridModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[var(--app-bg)]/85 backdrop-blur-xl overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-[color-mix(in_srgb,var(--card-bg)_80%,white)] border border-primary-500/40 rounded-[28px] p-5 sm:p-7 max-w-2xl w-full shadow-2xl relative my-6 max-h-[90vh] overflow-y-auto"
              >
                <button
                  onClick={() => setShowSectionsGridModal(false)}
                  className="absolute top-5 right-5 p-2 rounded-full bg-white/10 text-zinc-400 hover:text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-primary-500/20 text-primary-400 border border-primary-500/30">
                    <Grid className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-white">All App Sections (8)</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">Tap any feature to jump directly to it on phone or tablet</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
                  {[
                    { id: 'preset', icon: Sliders, label: 'Gear Configurator', desc: 'Custom budget tuning & brand swapping', isVipFeature: false },
                    { id: 'pcbuild', icon: Monitor, label: 'AI PC Builder', desc: 'Custom AI-recommended PC parts build', isVipFeature: false },
                    { id: 'builder', icon: Cpu, label: 'AI FPS Builder', desc: 'Predict gaming FPS & hardware bottlenecks', isVipFeature: true },
                    { id: 'price', icon: TrendingDown, label: 'Price Trend History', desc: '6-month price graph & buy indicators', isVipFeature: true },
                    { id: 'forum', icon: MessageSquare, label: 'Item Review Forum', desc: 'Community ratings & reviews', isVipFeature: false },
                    { id: 'ai', icon: Sparkles, label: '24/7 AI Concierge', desc: 'Personal hardware build consultant', isVipFeature: true },
                    { id: 'catalog', icon: Layers, label: 'Full Gear Catalog', desc: '33+ PH gaming mice, keyboards & headsets', isVipFeature: false },
                    { id: 'compare', icon: Sliders, label: 'Compare Gear Specs', desc: 'Side-by-side spec & feature comparison', isVipFeature: false },
                    { id: 'directory', icon: Store, label: 'PH Local Stores Directory', desc: 'DataBlitz, Shopee, EasyPC & GameOne', isVipFeature: false },
                  ].map((sec) => {
                    const Icon = sec.icon;
                    const isSelected = activeTab === sec.id;
                    return (
                      <button
                        key={sec.id}
                        onClick={() => {
                          setActiveTab(sec.id as any);
                          setShowSectionsGridModal(false);
                          triggerNotification(`Switched to ${sec.label}`);
                        }}
                        className={`p-4 rounded-2xl border text-left flex items-start gap-3.5 transition cursor-pointer ${
                          isSelected
                            ? 'bg-primary-500/20 border-primary-500/60 shadow-lg shadow-primary-500/10'
                            : 'bg-[var(--app-bg)]/50 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <div className={`p-2.5 rounded-xl shrink-0 flex items-center justify-center relative ${isSelected ? 'bg-primary-500 text-black font-bold' : 'bg-white/10 text-primary-400'}`}>
                          <Icon className="w-5 h-5" />
                          {sec.isVipFeature && !hasActiveVip && (
                            <div className="absolute -top-1.5 -right-1.5 bg-[var(--app-bg)] rounded-full border border-zinc-800 p-0.5">
                              <Lock className="w-2.5 h-2.5 text-primary-500" />
                            </div>
                          )}
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-sm text-white">{sec.label}</span>
                            {isSelected && <span className="text-[10px] bg-primary-500 text-black font-extrabold px-1.5 py-0.2 rounded">Active</span>}
                            {sec.isVipFeature && !isSelected && (
                              <span className="text-[9px] bg-primary-500/20 text-primary-300 border border-primary-500/30 px-1.5 py-0.2 rounded uppercase font-bold tracking-wider">VIP</span>
                            )}
                          </div>
                          <p className="text-xs text-zinc-400 leading-normal">{sec.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
                  <button
                    onClick={() => setShowSectionsGridModal(false)}
                    className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition cursor-pointer"
                  >
                    Close Menu
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <ThemeEditorModal
          isOpen={isThemeEditorOpen}
          onClose={() => setIsThemeEditorOpen(false)}
          customThemes={customThemes}
          currentThemeId={activeThemeId}
          onSaveTheme={(theme) => {
            const updated = [...customThemes, theme];
            setCustomThemes(updated);
            localStorage.setItem("gf_custom_themes", JSON.stringify(updated));
            setActiveThemeId(theme.id);
            localStorage.setItem("gf_active_theme_id", theme.id);
          }}
          onDeleteTheme={(id) => {
            const updated = customThemes.filter(t => t.id !== id);
            setCustomThemes(updated);
            localStorage.setItem("gf_custom_themes", JSON.stringify(updated));
            if (activeThemeId === id) {
              setActiveThemeId(BACKGROUND_THEMES[0].id);
              localStorage.setItem("gf_active_theme_id", BACKGROUND_THEMES[0].id);
            }
          }}
          onSelectTheme={(theme) => {
            setActiveThemeId(theme.id);
            localStorage.setItem("gf_active_theme_id", theme.id);
          }}
        />

        {/* Slide-Over Hamburger Drawer for PC, Tablet & Mobile */}
        <AnimatePresence>
          {isHamburgerOpen && (
            <div className="fixed inset-0 z-50 flex justify-end bg-[var(--app-bg)]/80 backdrop-blur-md">
              {/* Click outside backdrop to close */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsHamburgerOpen(false)}
                className="absolute inset-0"
              />

              {/* Slide-in Drawer Panel */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 26, stiffness: 220 }}
                className="relative z-10 w-full max-w-sm sm:max-w-md bg-[var(--card-bg)] border-l border-primary-500/30 h-full overflow-y-auto p-5 sm:p-6 flex flex-col justify-between shadow-2xl"
              >
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-2xl bg-primary-500/20 border border-primary-500/40 text-primary-400">
                        <Gamepad2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-extrabold text-white leading-tight">
                          Gear<span className="text-primary-400">Forge</span> Menu
                        </h3>
                        <span className="text-[11px] font-semibold text-zinc-400 block">All Features & Control Hub</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsHamburgerOpen(false)}
                      className="p-2.5 rounded-full bg-white/10 text-zinc-400 hover:text-white hover:bg-white/20 transition cursor-pointer"
                      title="Close Navigation Drawer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* User Profile Card */}
                  {user && (
                    <div className="space-y-2">
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img
                              src={user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.displayName}`}
                              alt="Avatar"
                              className="w-10 h-10 rounded-full border border-primary-400/50"
                            />
                            <div>
                              <span className="text-sm font-bold text-white block">{user.displayName}</span>
                              <span className="text-[11px] text-zinc-400">{user.email}</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1.5">
                            {(user.role === 'admin' || user.role === 'super_admin') && (
                              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase shrink-0 border ${
                                user.role === 'super_admin' ? 'bg-primary-500/20 text-primary-300 border-primary-500/40' : 'bg-primary-500/20 text-primary-300 border-primary-500/40'
                              }`}>
                                {user.role === 'super_admin' ? '👑 Super Admin' : '🛡️ Admin'}
                              </span>
                            )}
                            {user.role !== 'admin' && user.role !== 'super_admin' && (
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase shrink-0 ${
                                user.isTrialActive 
                                  ? 'bg-primary-500/20 text-primary-300 border border-primary-500/40'
                                  : user.hasPermanentAdFree 
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                  : user.isVip 
                                  ? 'bg-primary-500/20 text-primary-300 border border-primary-500/40'
                                  : 'bg-white/10 text-zinc-300'
                              }`}>
                                {user.isTrialActive ? '7-Day Trial' : user.hasPermanentAdFree ? 'Ad-Free' : user.isVip ? 'VIP Member' : 'Basic Tier'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      
                  {/* Theme Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                      <Palette className="w-4 h-4 text-primary-400" />
                      App Theme
                    </label>
                    <button
                      onClick={() => {
                        setIsHamburgerOpen(false);
                        setIsThemeEditorOpen(true);
                      }}
                      className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-3 px-4 text-sm text-white transition flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                          style={{ backgroundColor: [...BACKGROUND_THEMES, ...customThemes].find(t => t.id === activeThemeId)?.color || BACKGROUND_THEMES[0].color }}
                        />
                        <span className="font-bold">{[...BACKGROUND_THEMES, ...customThemes].find(t => t.id === activeThemeId)?.name || 'Theme'}</span>
                      </div>
                      <span className="text-xs text-primary-400 bg-primary-500/10 px-2 py-1 rounded-md font-bold uppercase tracking-wide whitespace-nowrap">Create / Edit Theme</span>
                    </button>
                  </div>

                      
                  <div className="space-y-2 pt-2 border-t border-white/10 mt-4">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2 pt-2">
                      {isDarkMode ? <Moon className="w-4 h-4 text-primary-400" /> : <Sun className="w-4 h-4 text-primary-400" />}
                      Appearance
                    </label>
                    <button
                      onClick={() => setIsDarkMode(!isDarkMode)}
                      className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-3 px-4 text-sm text-white transition flex items-center justify-between cursor-pointer"
                    >
                      <span>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
                      <div className={`w-10 h-5 rounded-full p-1 transition ${isDarkMode ? 'bg-primary-500' : 'bg-zinc-600'}`}>
                        <div className={`w-3 h-3 bg-white rounded-full transition transform ${isDarkMode ? 'translate-x-5' : 'translate-x-0'}`} />
                      </div>
                    </button>
                  </div>

                      {/* Admin Panel Access */}
                      {(user.role === 'admin' || user.role === 'super_admin') && (
                        <button
                          onClick={() => {
                            setIsAdminPanelOpen(true);
                            setIsHamburgerOpen(false);
                          }}
                          className="w-full p-3 rounded-2xl bg-primary-500/20 hover:bg-primary-500/30 border border-primary-500/40 text-primary-300 text-left cursor-pointer transition flex items-center justify-between shadow-lg shadow-blue-500/10"
                        >
                          <div className="flex items-center gap-2.5">
                            <ShieldCheck className="w-5 h-5 text-primary-400" />
                            <div>
                              <span className="font-extrabold text-xs block leading-tight">Admin Panel</span>
                              <span className="text-[10px] text-primary-300/80 block leading-tight">Manage users, roles & bans</span>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-primary-400 opacity-50" />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Navigation Links List */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-[10px] font-extrabold text-primary-400 uppercase tracking-widest block">
                        Quick App Sections (8)
                      </span>
                      <span className="text-[10px] text-zinc-500">Tap to jump</span>
                    </div>
                    <div className="space-y-1.5">
                      {[
                        { id: 'preset', icon: Sliders, label: 'Gear Configurator', desc: 'Custom loadouts & budget balancing', isVipFeature: false },
                        { id: 'pcbuild', icon: Monitor, label: 'AI PC Builder', desc: 'Custom PC Parts list by AI', isVipFeature: false },
                        { id: 'builder', icon: Cpu, label: 'AI FPS Builder', desc: 'Hardware bottlenecks & FPS predictor', isVipFeature: true },
                        { id: 'price', icon: TrendingDown, label: 'Price History Graphs', desc: '6-month market price trends', isVipFeature: true },
                        { id: 'forum', icon: MessageSquare, label: 'Item Review Forum', desc: 'Community gear ratings & feedback', isVipFeature: false },
                        { id: 'ai', icon: Sparkles, label: '24/7 AI PC Consultant', desc: 'AI hardware builder assistant', isVipFeature: true },
                        { id: 'catalog', icon: Layers, label: 'PH Gear Catalog', desc: '33+ PH gaming mice, keyboards & headsets', isVipFeature: false },
                        { id: 'compare', icon: Sliders, label: 'Compare Gear Specs', desc: 'Side-by-side specs analyzer', isVipFeature: false },
                        { id: 'directory', icon: Store, label: 'PH Stores Directory', desc: 'DataBlitz, Shopee & EasyPC', isVipFeature: false },
                      ].map((item) => {
                        const Icon = item.icon;
                        const isCurrent = activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              setActiveTab(item.id as any);
                              setIsHamburgerOpen(false);
                              triggerNotification(`Navigated to ${item.label}`);
                            }}
                            className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition cursor-pointer ${
                              isCurrent
                                ? 'bg-primary-500/20 border-primary-500/60 text-white shadow-lg'
                                : 'bg-white/5 border-white/5 hover:bg-white/10 text-zinc-300'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-xl shrink-0 flex items-center justify-center relative ${isCurrent ? 'bg-primary-500 text-black font-bold' : 'bg-white/10 text-primary-400'}`}>
                                <Icon className="w-4 h-4" />
                                {item.isVipFeature && !hasActiveVip && (
                                  <div className="absolute -top-1.5 -right-1.5 bg-[#0a0a0c] rounded-full border border-zinc-800 p-0.5">
                                    <Lock className="w-2 h-2 text-primary-500" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <span className="text-xs font-bold text-white block">{item.label}</span>
                                <span className="text-[10px] text-zinc-400 block">{item.desc}</span>
                              </div>
                            </div>
                            {isCurrent ? (
                              <span className="text-[10px] bg-primary-500 text-black font-extrabold px-2 py-0.5 rounded-full shrink-0">
                                Active
                              </span>
                            ) : item.isVipFeature ? (
                              <span className="text-[9px] bg-primary-500/20 text-primary-300 border border-primary-500/30 px-1.5 py-0.2 rounded font-bold uppercase tracking-wider shrink-0">
                                VIP
                              </span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>




                </div>

                {/* Footer */}
                <div className="pt-6 border-t border-white/10 space-y-3 mt-6">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>GearForge v2.5 (Global)</span>
                    <span>PH & Worldwide</span>
                  </div>
                  {user && (
                    <div className="space-y-2">
                      <button
                        onClick={async () => {
                          try {
                            const { auth } = await import('./lib/firebase');
                            await auth.signOut();
                          } catch (e) {
                            console.error('Sign out error:', e);
                          }
                          localStorage.removeItem('ph_gamer_user');
                          setUser(null);
                          setIsHamburgerOpen(false);
                          triggerNotification("Signed out successfully.");
                        }}
                        className="w-full py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer transition"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out Account</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsHamburgerOpen(false);
                          setIsDeleteModalOpen(true);
                        }}
                        className="w-full py-2.5 px-4 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-300 font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer transition"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                        <span>Delete Account Permanently</span>
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Tab Viewport */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              {['builder', 'price', 'ai'].includes(activeTab) && !hasActiveVip ? (
                <div className="bg-[var(--color-glass)] backdrop-blur-2xl p-8 rounded-[32px] border border-[var(--color-glass-border)] shadow-2xl flex flex-col items-center justify-center text-center space-y-6 py-20">
                  <div className="w-20 h-20 rounded-3xl bg-primary-500/10 flex items-center justify-center border border-primary-500/20 shadow-[0_0_30px_rgba(245,158,11,0.1)]">
                    <Lock className="w-10 h-10 text-primary-400" />
                  </div>
                  <div className="max-w-lg space-y-3">
                    <h2 className="text-3xl font-black text-white">VIP Exclusive Feature</h2>
                    <p className="text-zinc-400 leading-relaxed">
                      Unlock advanced tools like the AI FPS Builder, Price History Graphs, and your 24/7 AI Hardware Consultant by upgrading to GearForge VIP.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md pt-4">
                    <button
                      onClick={() => {
                        const trialUser = {
                          ...user,
                          isVip: true,
                          isTrialActive: true,
                          vipTierName: '7-Day VIP Free Trial',
                          trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
                        };
                        handleUpdateUser(trialUser, "🎉 7-Day VIP Free Trial Activated! Enjoy full AI features & 0 ads.");
                      }}
                      className="w-full px-6 py-3.5 rounded-2xl bg-primary-500/10 hover:bg-primary-500/20 text-primary-400 border border-primary-500/30 font-extrabold text-sm transition-all"
                    >
                      Start 7-Day Free Trial
                    </button>
                    <button
                      onClick={() => {
                        const vipUser = {
                          ...user,
                          isVip: true,
                          hasPermanentAdFree: true,
                          vipTierName: 'Permanent VIP Pass'
                        };
                        handleUpdateUser(vipUser, "⚡ Permanent VIP Status Unlocked!");
                      }}
                      className="w-full px-6 py-3.5 rounded-2xl bg-primary-500 hover:bg-primary-400 text-black border-2 border-primary-400 font-black text-sm transition-all shadow-lg shadow-primary-500/20"
                    >
                      Upgrade to VIP (₱149)
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {activeTab === 'preset' && (
                    <BudgetCalculator initialBudget={4500} onSaveLoadout={handleSaveLoadout} />
                  )}
                  {activeTab === 'pcbuild' && (
                    <PCBuilder onSaveLoadout={handleSaveLoadout} />
                  )}
                  {activeTab === 'builder' && (
                    <AIBudgetBuilder />
                  )}
                  {activeTab === 'price' && (
                    <PriceHistoryGraph />
                  )}
                  {activeTab === 'forum' && (
                    <ItemReviewForum currentUser={user} />
                  )}
                  {activeTab === 'ai' && (
                    <CustomLoadoutPlanner onSaveLoadout={handleSaveLoadout} />
                  )}
                  {activeTab === 'catalog' && (
                    <QuickCatalog />
                  )}
                  {activeTab === 'compare' && (
                    <CompareAccessories />
                  )}
                  {activeTab === 'directory' && (
                    <LocalStoresDirectory />
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Permanent Account Deletion Modal */}
        <AnimatePresence>
          {isDeleteModalOpen && user && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--app-bg)]/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="w-full max-w-md bg-[var(--card-bg)] border border-red-500/40 p-6 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden space-y-6"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-white tracking-tight">Delete Account Permanently?</h3>
                    <p className="text-[10px] text-red-400 font-extrabold uppercase tracking-wider">Irreversible Action</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-red-950/30 border border-red-500/20 text-xs text-zinc-300 space-y-2.5">
                  <p className="font-semibold text-white">
                    Are you sure you want to permanently delete this account?
                  </p>
                  <div className="p-2.5 rounded-xl bg-[var(--app-bg)]/70 border border-red-500/30 font-mono text-primary-300 truncate font-bold text-center text-xs">
                    {user.email || user.displayName}
                  </div>
                  <p className="text-zinc-400 leading-relaxed text-[11px]">
                    This action will permanently erase:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-zinc-400 text-[11px] pl-1">
                    <li>Saved PC hardware loadouts & gear setups</li>
                    <li>VIP member status and subscription badges</li>
                    <li>Price alerts and community forum reviews</li>
                    <li>Cloud database account record</li>
                  </ul>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsDeleteModalOpen(false)}
                    disabled={isDeletingAccount}
                    className="flex-1 py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handlePermanentDeleteAccount}
                    disabled={isDeletingAccount}
                    className="flex-1 py-3 px-4 rounded-2xl bg-red-600 hover:bg-red-700 border border-red-500 text-white font-extrabold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-900/30 disabled:opacity-50"
                  >
                    {isDeletingAccount ? (
                      <span>Deleting...</span>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        <span>Yes, Delete Account</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* 8 Default Avatar Choice Modal */}
        {user && (
          <>
            <RulesModal
              isOpen={!user.hasAcceptedRules}
              onAccept={handleAcceptRules}
              onDecline={handleDeclineRules}
            />
            <AvatarChoiceModal
            isOpen={isAvatarModalOpen}
            onClose={() => setIsAvatarModalOpen(false)}
            currentUser={user}
            onSelectAvatar={(photoURL, avatarName) => {
              handleUpdateUser({ ...user, photoURL }, `✨ Avatar updated to ${avatarName}!`);
            }}
          />
          </>
        )}

        {/* Admin Panel Modal */}
        {user && (user.role === 'admin' || user.role === 'super_admin') && (
          <AdminPanelModal
            isOpen={isAdminPanelOpen}
            onClose={() => setIsAdminPanelOpen(false)}
            currentUser={user}
            onUpdateCurrentUser={setUser}
          />
        )}

        {/* Global User Profile Modal */}
        <AnimatePresence>
          {selectedSearchUser && (
            <UserProfileModal
              username={selectedSearchUser}
              currentUser={user}
              onClose={() => setSelectedSearchUser(null)}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
