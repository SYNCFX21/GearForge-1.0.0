import React, { useState, useEffect } from 'react';
import { UserProfile, UserRole, Report } from '../types';
import { 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  Search, 
  X, 
  Ban, 
  VolumeX, 
  Volume2, 
  Clock, 
  Calendar, 
  Users, 
  UserCheck, 
  TrendingUp, 
  AlertTriangle,
  User,
  Crown,
  Lock,
  Unlock,
  CheckCircle2,
  Filter,
  BarChart2,
  Trash2,
  Flag,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getAllUsersFromFirestore, updateUserInFirestore, getReportsFromFirestore, updateReportStatusInFirestore } from '../lib/firestore';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUpdateUserList?: (updatedUsers: UserProfile[]) => void;
  onUpdateCurrentUser?: (user: UserProfile) => void;
}

// Pre-seeded community users to showcase month/year registration analytics & search
export const MOCK_COMMUNITY_USERS: UserProfile[] = [
  {
    uid: 'user-001',
    email: 'marco.reyes@gmail.com',
    displayName: 'Marco_FPS_PH',
    photoURL: 'https://api.dicebear.com/7.x/bottts/svg?seed=Marco_FPS_PH',
    providerId: 'google.com',
    registeredAt: '03/12/2026',
    createdAtMs: new Date('2026-03-12').getTime(),
    role: 'user',
    isVip: true
  },
  {
    uid: 'user-002',
    email: 'claire.santos@yahoo.com',
    displayName: 'ClaireTek_Gamer',
    photoURL: 'https://api.dicebear.com/7.x/bottts/svg?seed=ClaireTek',
    providerId: 'password',
    registeredAt: '07/18/2026',
    createdAtMs: new Date('2026-07-18').getTime(),
    role: 'admin',
    isVip: true
  },
  {
    uid: 'user-003',
    email: 'vince.tan@outlook.com',
    displayName: 'Vince_Valorant_God',
    photoURL: 'https://api.dicebear.com/7.x/bottts/svg?seed=VinceVal',
    providerId: 'google.com',
    registeredAt: '01/05/2026',
    createdAtMs: new Date('2026-01-05').getTime(),
    role: 'user',
    isMuted: true,
    mutedUntil: '08/15/2026'
  },
  {
    uid: 'user-004',
    email: 'angel.cruz@gmail.com',
    displayName: 'Angel_Keycaps_PH',
    photoURL: 'https://api.dicebear.com/7.x/bottts/svg?seed=AngelKeycaps',
    providerId: 'firebase',
    registeredAt: '06/22/2026',
    createdAtMs: new Date('2026-06-22').getTime(),
    role: 'user'
  },
  {
    uid: 'user-005',
    email: 'brian.mendoza@phgamer.net',
    displayName: 'Brian_RigBuilder',
    photoURL: 'https://api.dicebear.com/7.x/bottts/svg?seed=BrianRig',
    providerId: 'password',
    registeredAt: '11/14/2025',
    createdAtMs: new Date('2025-11-14').getTime(),
    role: 'user'
  },
  {
    uid: 'user-006',
    email: 'diane.ramos@gmail.com',
    displayName: 'Diane_Streamer',
    photoURL: 'https://api.dicebear.com/7.x/bottts/svg?seed=DianeStreamer',
    providerId: 'google.com',
    registeredAt: '04/08/2025',
    createdAtMs: new Date('2025-04-08').getTime(),
    role: 'user'
  },
  {
    uid: 'user-007',
    email: 'toxic.troll99@gmail.com',
    displayName: 'Spammy_Gamer_X',
    photoURL: 'https://api.dicebear.com/7.x/bottts/svg?seed=Spammy',
    providerId: 'password',
    registeredAt: '07/02/2026',
    createdAtMs: new Date('2026-07-02').getTime(),
    role: 'user',
    isSuspended: true,
    suspendedUntil: '08/30/2026'
  },
  {
    uid: 'user-008',
    email: 'cyberzone@mail.com',
    displayName: 'Cyberzone',
    photoURL: 'https://api.dicebear.com/7.x/bottts/svg?seed=Cyberzone',
    providerId: 'password',
    registeredAt: '07/28/2026',
    createdAtMs: new Date('2026-07-28').getTime(),
    role: 'user'
  }
];

/**
 * AdminPanelModal Component
 * Comprehensive administration and community moderation suite.
 * Features:
 * - User role management (User, Admin, Super Admin)
 * - VIP tier assignment and permanent ad-free status toggling
 * - Moderation actions (timed muting, temporary account suspensions, permanent bans)
 * - User registration growth and cohort analytics
 * - User report review triage queue
 * 
 * @whereUsed
 * - `src/App.tsx` (opened when an Admin clicks the Admin Shield icon in the top header)
 */
export default function AdminPanelModal({
  isOpen,
  onClose,
  currentUser,
  onUpdateCurrentUser
}: AdminPanelModalProps) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'reports'>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'super_admin' | 'admin' | 'user'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'muted' | 'suspended' | 'banned'>('all');
  const [filterReportStatus, setFilterReportStatus] = useState<'all' | 'pending' | 'reviewed' | 'dismissed'>('pending');

  // Selected user for action modals
  const [targetUser, setTargetUser] = useState<UserProfile | null>(null);
  const [showMuteModal, setShowMuteModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showBanConfirmModal, setShowBanConfirmModal] = useState(false);

  // Form values for Mute / Suspend modals
  const [muteDays, setMuteDays] = useState<number>(3);
  const [customMuteDate, setCustomMuteDate] = useState<string>('');
  const [suspendDays, setSuspendDays] = useState<number>(7);
  const [customSuspendDate, setCustomSuspendDate] = useState<string>('');

  const isSuperAdmin = currentUser.role === 'super_admin';
  const isAdmin = currentUser.role === 'admin' || isSuperAdmin;

  // Load and sync users list from Firestore
  useEffect(() => {
    if (!isOpen) return;

    const loadData = async () => {
      let dbUsers: UserProfile[] = [];
      let dbReports: Report[] = [];
      try {
        dbUsers = await getAllUsersFromFirestore();
        dbReports = await getReportsFromFirestore();
      } catch (e) {
        console.warn("Failed to load data from Firestore", e);
      }

      // Merge current user & seed mock community users if not present
      const map = new Map<string, UserProfile>();

      // Add current user first
      map.set(currentUser.uid, currentUser);

      // Add stored users
      dbUsers.forEach(u => map.set(u.uid, u));

      // Add seed community users
      MOCK_COMMUNITY_USERS.forEach(u => {
        if (!map.has(u.uid)) {
          map.set(u.uid, u);
        }
      });

      // Add local storage users
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('gf_user_')) {
            const localUser = JSON.parse(localStorage.getItem(key) || '{}');
            if (localUser && localUser.uid && !map.has(localUser.uid)) {
              map.set(localUser.uid, localUser);
            }
          }
        }
      } catch (e) {
        console.warn('Error reading local users', e);
      }

      const mergedList = Array.from(map.values()).filter(u => u && u.uid);
      setUsers(mergedList);
      setReports(dbReports);
    };

    loadData();
  }, [isOpen, currentUser]);

  // Handle report status change
  const handleReportAction = async (reportId: string, newStatus: Report['status']) => {
    await updateReportStatusInFirestore(reportId, newStatus);
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: newStatus } : r));
  };

  // Persist single updated user to Firestore and update local state
  const saveUpdatedUser = async (updatedUser: UserProfile) => {
    const updatedList = users.map(u => u.uid === updatedUser.uid ? updatedUser : u);
    setUsers(updatedList);
    
    // Persist to Firestore
    await updateUserInFirestore(updatedUser.uid, updatedUser);

    // If current logged-in user was modified, trigger state sync
    if (updatedUser.uid === currentUser.uid && onUpdateCurrentUser) {
      onUpdateCurrentUser(updatedUser);
    }
  };

  if (!isOpen) return null;

  // Filtered list based on search and status
  const filteredUsers = users.filter(u => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      (u.displayName && u.displayName.toLowerCase().includes(query)) ||
      (u.email && u.email.toLowerCase().includes(query)) ||
      (u.uid && u.uid.toLowerCase().includes(query)) ||
      (u.role || 'user').toLowerCase().includes(query);

    const matchesRole = filterRole === 'all' || (u.role || 'user') === filterRole;
    let matchesStatus = true;
    if (filterStatus === 'muted') matchesStatus = !!u.isMuted;
    if (filterStatus === 'suspended') matchesStatus = !!u.isSuspended;
    if (filterStatus === 'banned') matchesStatus = !!u.isBanned;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const filteredReports = reports.filter(r => {
    const matchesStatus = filterReportStatus === 'all' || r.status === filterReportStatus;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query ||
      (r.reportedUser && r.reportedUser.toLowerCase().includes(query)) ||
      (r.reporterName && r.reporterName.toLowerCase().includes(query)) ||
      (r.reportedContent && r.reportedContent.toLowerCase().includes(query)) ||
      (r.reason && r.reason.toLowerCase().includes(query));

    return matchesStatus && matchesSearch;
  });

  // Analytics Math Calculations
  const now = new Date();
  const currentMonthYear = `${now.getMonth() + 1}/${now.getFullYear()}`;
  const currentYear = now.getFullYear();

  const totalUsersCount = users.length;
  
  // Registered this month count
  const registeredThisMonthCount = users.filter(u => {
    if (!u.registeredAt) return false;
    const parts = u.registeredAt.split('/');
    if (parts.length === 3) {
      const month = parseInt(parts[0], 10);
      const year = parseInt(parts[2], 10);
      return month === (now.getMonth() + 1) && year === currentYear;
    }
    return false;
  }).length;

  // Registered this year count
  const registeredThisYearCount = users.filter(u => {
    if (!u.registeredAt) return false;
    const parts = u.registeredAt.split('/');
    if (parts.length === 3) {
      const year = parseInt(parts[2], 10);
      return year === currentYear;
    }
    return false;
  }).length;

  // Monthly breakdown map
  const monthlyBreakdown: Record<string, number> = {};
  const yearlyBreakdown: Record<string, number> = {};

  users.forEach(u => {
    if (u.registeredAt) {
      const parts = u.registeredAt.split('/');
      if (parts.length === 3) {
        const monthNum = parseInt(parts[0], 10);
        const yearNum = parseInt(parts[2], 10);
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthLabel = `${monthNames[monthNum - 1] || 'Month'} ${yearNum}`;
        monthlyBreakdown[monthLabel] = (monthlyBreakdown[monthLabel] || 0) + 1;
        yearlyBreakdown[`Year ${yearNum}`] = (yearlyBreakdown[`Year ${yearNum}`] || 0) + 1;
      }
    }
  });

  // Action Handler: Execute Mute
  const handleConfirmMute = () => {
    if (!targetUser) return;

    let expiryDateStr = '';
    if (customMuteDate) {
      // Format custom input YYYY-MM-DD to MM/DD/YYYY
      const parts = customMuteDate.split('-');
      if (parts.length === 3) {
        expiryDateStr = `${parts[1]}/${parts[2]}/${parts[0]}`;
      } else {
        expiryDateStr = customMuteDate;
      }
    } else {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + muteDays);
      const m = String(targetDate.getMonth() + 1).padStart(2, '0');
      const d = String(targetDate.getDate()).padStart(2, '0');
      const y = targetDate.getFullYear();
      expiryDateStr = `${m}/${d}/${y}`;
    }

    const updatedUser = {
      ...targetUser,
      isMuted: true,
      mutedUntil: expiryDateStr
    };

    saveUpdatedUser(updatedUser);
    setShowMuteModal(false);
    setTargetUser(null);
    setCustomMuteDate('');
  };

  // Action Handler: Unmute
  const handleUnmute = (u: UserProfile) => {
    const updatedUser = {
      ...u,
      isMuted: false,
      mutedUntil: undefined
    };
    saveUpdatedUser(updatedUser);
  };

  // Action Handler: Execute Suspend
  const handleConfirmSuspend = () => {
    if (!targetUser || !isSuperAdmin) return;

    let expiryDateStr = '';
    if (customSuspendDate) {
      const parts = customSuspendDate.split('-');
      if (parts.length === 3) {
        expiryDateStr = `${parts[1]}/${parts[2]}/${parts[0]}`;
      } else {
        expiryDateStr = customSuspendDate;
      }
    } else {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + suspendDays);
      const m = String(targetDate.getMonth() + 1).padStart(2, '0');
      const d = String(targetDate.getDate()).padStart(2, '0');
      const y = targetDate.getFullYear();
      expiryDateStr = `${m}/${d}/${y}`;
    }

    const updatedUser = {
      ...targetUser,
      isSuspended: true,
      suspendedUntil: expiryDateStr
    };

    saveUpdatedUser(updatedUser);
    setShowSuspendModal(false);
    setTargetUser(null);
    setCustomSuspendDate('');
  };

  // Action Handler: Unsuspend (Open Account Anytime)
  const handleUnsuspend = (u: UserProfile) => {
    if (!isSuperAdmin) return;
    const updatedUser = {
      ...u,
      isSuspended: false,
      suspendedUntil: undefined
    };
    saveUpdatedUser(updatedUser);
  };

  // Action Handler: Execute Permanent Ban
  const handleConfirmPermanentBan = () => {
    if (!targetUser || !isSuperAdmin) return;

    const updatedUser = {
      ...targetUser,
      isBanned: true,
      isSuspended: false,
      isMuted: false
    };

    saveUpdatedUser(updatedUser);
    setShowBanConfirmModal(false);
    setTargetUser(null);
  };

  // Action Handler: Unban
  const handleUnban = (u: UserProfile) => {
    if (!isSuperAdmin) return;
    const updatedUser = {
      ...u,
      isBanned: false
    };
    saveUpdatedUser(updatedUser);
  };

  // Action Handler: Toggle Role (User <-> Admin)
  const handleToggleUserRole = (u: UserProfile) => {
    if (!isSuperAdmin) return;
    if (u.uid === currentUser.uid) return; // Cannot demote self

    const newRole: UserRole = u.role === 'admin' ? 'user' : 'admin';
    const updatedUser = { ...u, role: newRole };

    saveUpdatedUser(updatedUser);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[var(--app-bg)]/80 backdrop-blur-xl overflow-y-auto">
      
      {/* Container Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-6xl bg-[var(--card-bg)] border border-primary-500/40 rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] relative"
      >
        {/* Header Bar */}
        <div className="p-5 sm:p-6 bg-[var(--card-bg)] border-b border-primary-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between shrink-0 gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl border ${isSuperAdmin ? 'bg-primary-500/20 text-primary-400 border-primary-500/40' : 'bg-primary-500/20 text-primary-400 border-primary-500/40'}`}>
              {isSuperAdmin ? <Crown className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">GearForge Admin Panel</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                  isSuperAdmin 
                    ? 'bg-primary-500/20 text-primary-300 border-primary-500/40' 
                    : 'bg-primary-500/20 text-primary-300 border-primary-500/40'
                }`}>
                  {isSuperAdmin ? 'Super Admin' : 'Admin'}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                {isSuperAdmin 
                  ? 'Full administrative control: User analytics, Mute, Suspend, Permanent Ban & Role hierarchy.' 
                  : 'Moderation control: Mute toxic users in forums and gear reviews.'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex bg-[var(--app-bg)]/40 border border-white/10 rounded-xl p-1 shrink-0">
              <button
                onClick={() => setActiveTab('users')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 ${activeTab === 'users' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <Users className="w-4 h-4" />
                Users
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 ${activeTab === 'reports' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <Flag className="w-4 h-4" />
                Reports
                {reports.filter(r => r.status === 'pending').length > 0 && (
                  <span className="bg-primary-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    {reports.filter(r => r.status === 'pending').length}
                  </span>
                )}
              </button>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-2xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition cursor-pointer self-start sm:self-auto"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body Content */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
          {activeTab === 'users' ? (
            <>
              {/* SECTION 1: USER REGISTRATION STATS & ANALYTICS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest text-primary-400 flex items-center gap-2 font-mono">
                <BarChart2 className="w-4 h-4" />
                <span>User Creation & Growth Analytics</span>
              </h3>
              <span className="text-[10px] font-bold text-zinc-500 font-mono">Real-time Metrics</span>
            </div>

            {/* Metric Score Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-[var(--app-bg)]/50 border border-white/10 space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-zinc-400 block font-mono">Total Users</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black text-white font-mono">{totalUsersCount}</span>
                  <Users className="w-4 h-4 text-primary-400" />
                </div>
                <span className="text-[10px] text-zinc-500 block">Registered in database</span>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--app-bg)]/50 border border-primary-500/30 space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-primary-300 block font-mono">Created This Month</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black text-primary-400 font-mono">{registeredThisMonthCount}</span>
                  <TrendingUp className="w-4 h-4 text-primary-400" />
                </div>
                <span className="text-[10px] text-primary-500/80 block">Current Month ({currentMonthYear})</span>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--app-bg)]/50 border border-emerald-500/30 space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-emerald-300 block font-mono">Created This Year</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black text-emerald-400 font-mono">{registeredThisYearCount}</span>
                  <Calendar className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-[10px] text-emerald-500/80 block">Year {currentYear} Growth</span>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--app-bg)]/50 border border-red-500/30 space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-red-300 block font-mono">Moderated Accounts</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black text-red-400 font-mono">
                    {users.filter(u => u.isMuted || u.isSuspended || u.isBanned).length}
                  </span>
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                </div>
                <span className="text-[10px] text-red-400/80 block">Muted, Suspended & Banned</span>
              </div>
            </div>

            {/* Monthly & Yearly Registration Breakdown Chips */}
            <div className="p-4 rounded-2xl bg-[var(--app-bg)]/30 border border-white/5 space-y-3">
              <span className="text-[11px] font-extrabold text-zinc-300 uppercase tracking-wider block font-mono">
                Monthly & Yearly Registration Breakdown
              </span>
              
              <div className="flex flex-wrap gap-2">
                {Object.entries(monthlyBreakdown).map(([label, count]) => (
                  <div key={label} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs flex items-center gap-2">
                    <span className="text-zinc-300 font-bold">{label}:</span>
                    <span className="text-primary-400 font-mono font-extrabold">{count} users</span>
                  </div>
                ))}
                {Object.entries(yearlyBreakdown).map(([label, count]) => (
                  <div key={label} className="px-3 py-1.5 rounded-xl bg-primary-500/10 border border-primary-500/30 text-xs flex items-center gap-2">
                    <span className="text-primary-300 font-bold">{label}:</span>
                    <span className="text-white font-mono font-extrabold">{count} total</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 2: USER SEARCH & MANAGEMENT CONTROLS */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <h3 className="text-xs font-black uppercase tracking-widest text-primary-400 flex items-center gap-2 font-mono">
                <Users className="w-4 h-4" />
                <span>Search & Manage Registered Users</span>
              </h3>

              {/* Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                <span className="text-[10px] text-zinc-400 font-extrabold uppercase shrink-0">Filter Role:</span>
                {(['all', 'super_admin', 'admin', 'user'] as const).map(role => (
                  <button
                    key={role}
                    onClick={() => setFilterRole(role)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition cursor-pointer shrink-0 ${
                      filterRole === role 
                        ? 'bg-primary-500 text-black' 
                        : 'bg-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {role === 'all' ? 'All Roles' : role.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* SEARCH BAR INPUT */}
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search user by Gamer Display Name, Email address, User ID (UID), or Role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[var(--app-bg)]/60 border border-primary-500/30 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-primary-400 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-3 text-xs text-zinc-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* USER LIST TABLE / CARDS */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider px-2 font-mono">
                <span>Showing {filteredUsers.length} of {users.length} Users</span>
                <span>Actions: Mute • Suspend • Permanent Ban</span>
              </div>

              {filteredUsers.length === 0 ? (
                <div className="p-8 text-center bg-[var(--app-bg)]/40 border border-white/5 rounded-2xl text-zinc-500 text-xs">
                  No users found matching "{searchQuery}".
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredUsers.map(u => {
                    const isSelf = u.uid === currentUser.uid;
                    const uRole = u.role || 'user';

                    return (
                      <div 
                        key={u.uid}
                        className={`p-3.5 sm:p-4 rounded-2xl border transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                          u.isBanned
                            ? 'bg-red-950/20 border-red-500/40'
                            : u.isSuspended
                            ? 'bg-primary-950/20 border-primary-500/40'
                            : u.isMuted
                            ? 'bg-purple-950/20 border-primary-500/40'
                            : 'bg-[var(--app-bg)]/40 border-white/10 hover:border-white/20'
                        }`}
                      >
                        {/* User Identity Details */}
                        <div className="flex items-center gap-3">
                          <img
                            src={u.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.displayName}`}
                            alt={u.displayName}
                            className="w-10 h-10 rounded-full border border-primary-400/50 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-extrabold text-sm text-white">{u.displayName}</span>
                              
                              {/* Role Badge */}
                              <span className={`px-2 py-0.2 rounded text-[10px] font-black uppercase tracking-wider border ${
                                uRole === 'super_admin'
                                  ? 'bg-primary-500/20 text-primary-300 border-primary-500/40'
                                  : uRole === 'admin'
                                  ? 'bg-primary-500/20 text-primary-300 border-primary-500/40'
                                  : 'bg-white/10 text-zinc-300 border-white/15'
                              }`}>
                                {uRole === 'super_admin' ? '👑 Super Admin' : uRole === 'admin' ? '🛡️ Admin' : '👤 User'}
                              </span>

                              {isSelf && (
                                <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 text-[9px] font-extrabold rounded border border-emerald-500/30">
                                  You
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-zinc-400 flex items-center gap-2 flex-wrap font-mono">
                              <span>{u.email}</span>
                              <span className="text-zinc-600">•</span>
                              <span className="text-zinc-500">Registered: {u.registeredAt || '03/2026'}</span>
                            </p>

                            {/* Status Indicators */}
                            <div className="flex items-center gap-2 flex-wrap pt-1">
                              {u.isBanned && (
                                <span className="px-2 py-0.5 rounded bg-red-500/30 text-red-300 text-[10px] font-black uppercase border border-red-500/50 flex items-center gap-1">
                                  <Ban className="w-3 h-3 text-red-400" />
                                  <span>Permanently Banned</span>
                                </span>
                              )}

                              {u.isSuspended && (
                                <span className="px-2 py-0.5 rounded bg-primary-500/30 text-primary-300 text-[10px] font-black uppercase border border-primary-500/50 flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-primary-400" />
                                  <span>Suspended Until: {u.suspendedUntil || 'Specified Date'}</span>
                                </span>
                              )}

                              {u.isMuted && (
                                <span className="px-2 py-0.5 rounded bg-primary-500/30 text-primary-300 text-[10px] font-black uppercase border border-primary-500/50 flex items-center gap-1">
                                  <VolumeX className="w-3 h-3 text-primary-400" />
                                  <span>Muted Until: {u.mutedUntil || 'Specified Date'}</span>
                                </span>
                              )}

                              {!u.isBanned && !u.isSuspended && !u.isMuted && (
                                <span className="px-2 py-0.2 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                                  Active Status
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons for Admins & Super Admins */}
                        <div className="flex items-center gap-2 flex-wrap shrink-0 justify-end">
                          
                          {/* Role Promotion / Demotion (Super Admin Only) */}
                          {isSuperAdmin && !isSelf && (
                            <button
                              onClick={() => handleToggleUserRole(u)}
                              title={uRole === 'admin' ? "Demote to Standard User" : "Promote to Admin"}
                              className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-zinc-300 hover:text-white transition cursor-pointer flex items-center gap-1"
                            >
                              <Shield className="w-3.5 h-3.5 text-primary-400" />
                              <span>{uRole === 'admin' ? 'Demote User' : 'Make Admin'}</span>
                            </button>
                          )}

                          {!isSelf && (
                            <>
                              {/* 1. MUTE BUTTON (Admin & Super Admin) */}
                              {u.isMuted ? (
                                <button
                                  onClick={() => handleUnmute(u)}
                                  className="px-3 py-1.5 rounded-xl bg-primary-500/20 hover:bg-primary-500/30 border border-primary-500/40 text-primary-300 text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
                                >
                                  <Volume2 className="w-3.5 h-3.5" />
                                  <span>Unmute</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    setTargetUser(u);
                                    setShowMuteModal(true);
                                  }}
                                  className="px-3 py-1.5 rounded-xl bg-primary-500/10 hover:bg-primary-500/20 border border-primary-500/30 text-primary-300 text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
                                >
                                  <VolumeX className="w-3.5 h-3.5" />
                                  <span>Mute</span>
                                </button>
                              )}

                              {/* 2. SUSPEND BUTTON (Super Admin Only) */}
                              {isSuperAdmin && (
                                u.isSuspended ? (
                                  <button
                                    onClick={() => handleUnsuspend(u)}
                                    className="px-3 py-1.5 rounded-xl bg-primary-500/20 hover:bg-primary-500/30 border border-primary-500/40 text-primary-300 text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
                                  >
                                    <Unlock className="w-3.5 h-3.5" />
                                    <span>Unsuspend</span>
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => {
                                      setTargetUser(u);
                                      setShowSuspendModal(true);
                                    }}
                                    className="px-3 py-1.5 rounded-xl bg-primary-500/10 hover:bg-primary-500/20 border border-primary-500/30 text-primary-300 text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
                                  >
                                    <Lock className="w-3.5 h-3.5" />
                                    <span>Suspend</span>
                                  </button>
                                )
                              )}

                              {/* 3. PERMANENT BAN BUTTON (Placed NEXT to Suspend Button - Super Admin Only) */}
                              {isSuperAdmin && (
                                u.isBanned ? (
                                  <button
                                    onClick={() => handleUnban(u)}
                                    className="px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Unban</span>
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => {
                                      setTargetUser(u);
                                      setShowBanConfirmModal(true);
                                    }}
                                    className="px-3 py-1.5 rounded-xl bg-red-500 text-white hover:bg-red-600 border border-red-400 font-extrabold text-xs transition cursor-pointer flex items-center gap-1 shadow-md shadow-red-500/20"
                                  >
                                    <Ban className="w-3.5 h-3.5" />
                                    <span>Permanent Ban</span>
                                  </button>
                                )
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
            </>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-widest text-primary-400 flex items-center gap-2 font-mono">
                  <Flag className="w-4 h-4" />
                  <span>Reported Reviews & Users</span>
                </h3>
                <div className="flex bg-[var(--app-bg)]/40 border border-white/10 rounded-xl p-1 shrink-0">
                  <button
                    onClick={() => setFilterReportStatus('all')}
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition ${filterReportStatus === 'all' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilterReportStatus('pending')}
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition flex items-center gap-1 ${filterReportStatus === 'pending' ? 'bg-primary-500/20 text-primary-400' : 'text-zinc-500 hover:text-primary-400'}`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setFilterReportStatus('reviewed')}
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition flex items-center gap-1 ${filterReportStatus === 'reviewed' ? 'bg-primary-500/20 text-primary-400' : 'text-zinc-500 hover:text-primary-400'}`}
                  >
                    Reviewed
                  </button>
                  <button
                    onClick={() => setFilterReportStatus('dismissed')}
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition flex items-center gap-1 ${filterReportStatus === 'dismissed' ? 'bg-emerald-500/20 text-emerald-400' : 'text-zinc-500 hover:text-emerald-400'}`}
                  >
                    Dismissed
                  </button>
                </div>
              </div>

              {filteredReports.length === 0 ? (
                <div className="py-12 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-center bg-[var(--app-bg)]/20">
                  <Flag className="w-10 h-10 text-zinc-600 mb-3" />
                  <p className="text-zinc-400 font-bold text-sm">No reports found.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredReports.map(report => (
                    <div key={report.id} className="p-4 rounded-2xl bg-[var(--app-bg)]/40 border border-white/10 flex flex-col md:flex-row gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${
                            report.status === 'pending' ? 'bg-primary-500/20 text-primary-400 border-primary-500/40' :
                            report.status === 'reviewed' ? 'bg-primary-500/20 text-primary-400 border-primary-500/40' :
                            'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          }`}>
                            {report.status}
                          </span>
                          <span className="text-[10px] text-zinc-500 font-mono">
                            Reported by: <strong className="text-zinc-300">{report.reporterName}</strong>
                          </span>
                          <span className="text-[10px] text-zinc-600 font-mono">•</span>
                          <span className="text-[10px] text-zinc-500 font-mono">
                            Target: <strong className="text-zinc-300">{report.reportedUser || 'Unknown'}</strong>
                          </span>
                          <span className="text-[10px] text-zinc-600 font-mono">•</span>
                          <span className="text-[10px] text-zinc-500 font-mono">
                            {new Date(report.createdAt).toLocaleDateString('en-PH')}
                          </span>
                        </div>
                        
                        <div>
                          <p className="text-[11px] font-bold text-zinc-400 mb-1 uppercase tracking-wider font-mono">Reason for report</p>
                          <p className="text-sm text-primary-300 bg-rose-950/30 p-2.5 rounded-xl border border-primary-500/20">"{report.reason}"</p>
                        </div>
                        
                        <div>
                          <p className="text-[11px] font-bold text-zinc-400 mb-1 uppercase tracking-wider font-mono">Reported Content</p>
                          <div className="text-xs text-zinc-300 bg-[var(--app-bg)]/50 p-3 rounded-xl border border-white/5 italic">
                            "{report.reportedContent}"
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 shrink-0 md:w-32 justify-center">
                        {report.status !== 'pending' && (
                          <button
                            onClick={() => handleReportAction(report.id, 'pending')}
                            className="px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700 transition"
                          >
                            Mark Pending
                          </button>
                        )}
                        {report.status !== 'reviewed' && (
                          <button
                            onClick={() => handleReportAction(report.id, 'reviewed')}
                            className="px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase bg-primary-500/20 text-primary-400 hover:bg-primary-500/30 border border-primary-500/40 transition"
                          >
                            Mark Reviewed
                          </button>
                        )}
                        {report.status !== 'dismissed' && (
                          <button
                            onClick={() => handleReportAction(report.id, 'dismissed')}
                            className="px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/40 transition"
                          >
                            Dismiss
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* POPUP MODAL 1: MUTE USER MODAL */}
      <AnimatePresence>
        {showMuteModal && targetUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--app-bg)]/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[var(--card-bg)] border border-primary-500/40 p-6 rounded-3xl shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-primary-500/20 pb-3">
                <div className="flex items-center gap-2 text-primary-400">
                  <VolumeX className="w-5 h-5" />
                  <h3 className="font-extrabold text-base text-white">Mute User in Forums & Reviews</h3>
                </div>
                <button onClick={() => setShowMuteModal(false)} className="text-zinc-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-zinc-300">
                  Muting <strong>{targetUser.displayName}</strong> ({targetUser.email}) prevents them from writing new gear reviews or forum comments.
                </p>

                {/* Preset Days Options */}
                <label className="text-[11px] font-bold text-primary-300 uppercase tracking-wider block pt-2">
                  Select Mute Duration (Days)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 3, 7, 30].map(days => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => {
                        setMuteDays(days);
                        setCustomMuteDate('');
                      }}
                      className={`py-2 text-xs font-extrabold rounded-xl border transition ${
                        muteDays === days && !customMuteDate
                          ? 'bg-primary-500 text-white border-primary-400'
                          : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {days} {days === 1 ? 'Day' : 'Days'}
                    </button>
                  ))}
                </div>

                {/* Custom MM/DD/YYYY Date Picker */}
                <div className="space-y-1 pt-2">
                  <label className="text-[11px] font-bold text-primary-300 uppercase tracking-wider block">
                    Or Pick Specific Expiration Date (MM/DD/YYYY)
                  </label>
                  <input
                    type="date"
                    value={customMuteDate}
                    onChange={(e) => setCustomMuteDate(e.target.value)}
                    className="w-full bg-[var(--app-bg)]/60 border border-primary-500/30 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-primary-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  onClick={() => setShowMuteModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmMute}
                  className="px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-xs font-extrabold shadow-lg shadow-purple-500/30 cursor-pointer"
                >
                  Confirm Mute
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* POPUP MODAL 2: SUSPEND USER MODAL */}
      <AnimatePresence>
        {showSuspendModal && targetUser && isSuperAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--app-bg)]/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[var(--card-bg)] border border-primary-500/40 p-6 rounded-3xl shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-primary-500/20 pb-3">
                <div className="flex items-center gap-2 text-primary-400">
                  <Lock className="w-5 h-5" />
                  <h3 className="font-extrabold text-base text-white">Suspend Account Access</h3>
                </div>
                <button onClick={() => setShowSuspendModal(false)} className="text-zinc-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-zinc-300">
                  Suspending <strong>{targetUser.displayName}</strong> ({targetUser.email}) will block them from accessing all GearForge tools until the specified date.
                </p>

                {/* Preset Days Options */}
                <label className="text-[11px] font-bold text-primary-300 uppercase tracking-wider block pt-2">
                  Select Suspension Duration (Days)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 7, 30, 90].map(days => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => {
                        setSuspendDays(days);
                        setCustomSuspendDate('');
                      }}
                      className={`py-2 text-xs font-extrabold rounded-xl border transition ${
                        suspendDays === days && !customSuspendDate
                          ? 'bg-primary-500 text-black border-primary-400'
                          : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {days} Days
                    </button>
                  ))}
                </div>

                {/* Custom Date Input */}
                <div className="space-y-1 pt-2">
                  <label className="text-[11px] font-bold text-primary-300 uppercase tracking-wider block">
                    Or Pick Specific Expiration Date (MM/DD/YYYY)
                  </label>
                  <input
                    type="date"
                    value={customSuspendDate}
                    onChange={(e) => setCustomSuspendDate(e.target.value)}
                    className="w-full bg-[var(--app-bg)]/60 border border-primary-500/30 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-primary-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  onClick={() => setShowSuspendModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmSuspend}
                  className="px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-400 text-black text-xs font-extrabold shadow-lg shadow-primary-500/30 cursor-pointer"
                >
                  Confirm Suspension
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* POPUP MODAL 3: ALWAYS ASK CONFIRMATION FOR PERMANENT BAN */}
      <AnimatePresence>
        {showBanConfirmModal && targetUser && isSuperAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--app-bg)]/85 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[var(--card-bg)] border border-red-500/60 p-6 rounded-3xl shadow-2xl space-y-4"
            >
              <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-2xl flex items-center gap-3 text-red-400">
                <AlertTriangle className="w-6 h-6 shrink-0" />
                <div>
                  <h3 className="font-extrabold text-sm text-white">Permanent Ban Confirmation</h3>
                  <p className="text-[11px] text-red-300">This action requires explicit admin confirmation.</p>
                </div>
              </div>

              <p className="text-sm text-zinc-200 leading-relaxed">
                Are you sure you want to <strong>permanently ban</strong> the account for <span className="text-primary-400 font-bold">{targetUser.displayName}</span> ({targetUser.email})?
              </p>

              <div className="p-3 bg-[var(--app-bg)]/50 border border-white/10 rounded-2xl text-xs text-zinc-400 space-y-1">
                <p className="text-zinc-300 font-bold">What happens next:</p>
                <p>• User will be permanently locked out of all GearForge tools.</p>
                <p>• They will see a permanent ban message upon logging in.</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  onClick={() => setShowBanConfirmModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-zinc-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmPermanentBan}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black tracking-wider uppercase shadow-lg shadow-red-600/40 cursor-pointer"
                >
                  Yes, Permanently Ban User
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
