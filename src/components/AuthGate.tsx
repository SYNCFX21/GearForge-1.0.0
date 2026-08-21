import React, { useState } from 'react';
import { UserProfile } from '../types';
import { 
  LogIn, 
  UserPlus, 
  Sparkles, 
  Smartphone, 
  Laptop, 
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Globe,
  Loader2,
  Database,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth } from '../lib/firebase';
import { saveUserProfileToGearForgeDB } from '../lib/firestore';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

interface AuthGateProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export default function AuthGate({ onLoginSuccess }: AuthGateProps) {
  const [isLoginMode, setIsLoginMode] = useState<boolean>(false); // Default to Create Account for easy onboard
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Format Firebase auth error code into friendly user message
  const getFriendlyErrorMessage = (code?: string, rawMsg?: string): string => {
    switch (code) {
      case 'auth/operation-not-allowed':
        return 'Firebase Email/Password login is not enabled in Firebase Console. Use Google Sign-In or Quick GearForge Sign-Up below.';
      case 'auth/email-already-in-use':
        return 'This email is already registered in GearForge. Please switch to "Sign In" or use Google Sign-In.';
      case 'auth/weak-password':
        return 'Password must be at least 6 characters long.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/invalid-credential':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Invalid email or password. Please check your credentials.';
      default:
        return rawMsg || 'Account operation failed. Please try again or use Google Sign-In.';
    }
  };

  const handleStandardAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    if (!isLoginMode && !displayName) {
      setError('Please enter a display name for your GearForge account.');
      return;
    }

    setIsLoading(true);

    try {
      if (isLoginMode) {
        // Try Firebase sign-in
        let userCredential;
        try {
          userCredential = await signInWithEmailAndPassword(auth, email, password);
        } catch (firebaseErr: any) {
          // Fallback check for local GearForgeDB account
          const stored = localStorage.getItem(`gf_user_${email.toLowerCase().trim()}`);
          if (stored) {
            const parsed = JSON.parse(stored);
            localStorage.setItem('ph_gamer_user', JSON.stringify(parsed));
            onLoginSuccess(parsed);
            return;
          }
          throw firebaseErr;
        }

        const loggedUser: UserProfile = {
          uid: userCredential.user.uid,
          email: userCredential.user.email || email,
          displayName: userCredential.user.displayName || displayName || email.split('@')[0].toUpperCase(),
          photoURL: userCredential.user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${userCredential.user.uid}`,
          providerId: 'password',
          registeredAt: userCredential.user.metadata.creationTime ? new Date(userCredential.user.metadata.creationTime).toLocaleDateString('en-PH') : new Date().toLocaleDateString('en-PH'),
          
        };

        await saveUserProfileToGearForgeDB(loggedUser.uid, loggedUser);
        localStorage.setItem('ph_gamer_user', JSON.stringify(loggedUser));
        onLoginSuccess(loggedUser);
      } else {
        // Create account flow
        let uid = `gf-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
        let firebaseSuccess = false;

        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          uid = userCredential.user.uid;
          await updateProfile(userCredential.user, {
            displayName: displayName,
            photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=${uid}`
          });
          firebaseSuccess = true;
        } catch (firebaseErr: any) {
          console.warn("Firebase Auth attempt notice:", firebaseErr.code, firebaseErr.message);
          // If password < 6 chars, demand valid password length
          if (firebaseErr.code === 'auth/weak-password') {
            setError('Password must be at least 6 characters long.');
            setIsLoading(false);
            return;
          }
          if (firebaseErr.code === 'auth/invalid-email') {
            setError('Please enter a valid email address.');
            setIsLoading(false);
            return;
          }
          // If operation-not-allowed or email-already-in-use, show clear notice
          if (firebaseErr.code === 'auth/email-already-in-use') {
            setError('This email is already registered in GearForge. Please switch to Sign In.');
            setIsLoading(false);
            return;
          }
        }

        const newUser: UserProfile = {
          uid,
          email,
          displayName,
          photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=${uid}`,
          providerId: 'firebase',
          registeredAt: new Date().toLocaleDateString('en-PH'),
          role: (email && email.toLowerCase() === 'aaronsalagubang21@gmail.com') ? 'super_admin' : 'user',
          isVip: false,
          hasPermanentAdFree: false,
          isMuted: false,
        };

        if (newUser.role === 'super_admin') {
          newUser.displayName = 'Aaron Lanceta';
        }

        // Save profile to GearForgeDB Firestore & localStorage
        await saveUserProfileToGearForgeDB(newUser.uid, newUser);
        localStorage.setItem(`gf_user_${email.toLowerCase().trim()}`, JSON.stringify(newUser));
        localStorage.setItem('ph_gamer_user', JSON.stringify(newUser));

        setSuccess(`Welcome to GearForge, ${displayName}! Logging you in...`);
        setTimeout(() => {
          onLoginSuccess(newUser);
        }, 500);
      }
    } catch (err: any) {
      console.error(err);
      setError(getFriendlyErrorMessage(err.code, err.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const loggedUser: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'Gamer',
        photoURL: user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`,
        providerId: 'firebase',
        registeredAt: user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString('en-PH') : new Date().toLocaleDateString('en-PH'),
        role: (user.email && user.email.toLowerCase() === 'aaronsalagubang21@gmail.com') ? 'super_admin' : 'user',
        isVip: false,
        hasPermanentAdFree: false,
        isMuted: false,
      };

      // Ensure super_admin gets the right displayName
      if (loggedUser.role === 'super_admin') {
        loggedUser.displayName = 'Aaron Lanceta';
      }

      await saveUserProfileToGearForgeDB(loggedUser.uid, loggedUser);
      localStorage.setItem('ph_gamer_user', JSON.stringify(loggedUser));
      onLoginSuccess(loggedUser);
    } catch (err: any) {
      console.error('Google login error:', err);
      setError(err.message || 'Google authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch z-10 my-8">
        
        {/* Left Side: GearForge Info & Setup Guide */}
        <div className="flex flex-col justify-between space-y-8 bg-[var(--app-bg)]/40 backdrop-blur-2xl border border-primary-500/30 p-8 rounded-[32px] shadow-2xl">
          <div className="space-y-4">
            <div className="space-y-1">
              <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                Gear Up. <br />
                <span className="text-primary-400">GearForge</span>
              </h1>
            </div>

            <p className="text-sm text-zinc-400 leading-relaxed font-medium max-w-sm">
              Your custom gaming setups, price history trackers, and reviews are synced live in <strong>GearForge</strong>.
            </p>
          </div>

          {/* Features Checklist */}
          <div className="space-y-4 pt-6 border-t border-white/10">
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center border border-primary-500/40">
                <ShieldCheck className="w-4 h-4 text-primary-400" />
              </div>
              <h3 className="text-sm font-extrabold">GearForge Cloud Features</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex gap-3 items-start">
                <div className="bg-white/5 p-2 rounded-xl text-primary-400 border border-white/5 shrink-0">
                  <Database className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-zinc-200 block">Real-time Loadout Sync</span>
                  <p className="text-[11px] text-zinc-400 leading-normal">
                    Save unlimited PC hardware and peripheral loadouts to GearForge.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="bg-white/5 p-2 rounded-xl text-primary-400 border border-white/5 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-zinc-200 block">VIP Gamer Pass Included</span>
                  <p className="text-[11px] text-zinc-400 leading-normal">
                    All new accounts receive full VIP access, AI FPS builder tools & ad-free features.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Account Creation & Login Panel */}
        <div className="flex flex-col justify-center bg-[var(--card-bg)]/90 backdrop-blur-2xl p-8 rounded-[32px] border border-primary-500/30 shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />

          <AnimatePresence mode="wait">
            <motion.div
              key={isLoginMode ? 'login' : 'register'}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-black text-white tracking-tight">
                  {isLoginMode ? 'GearForge Sign In' : 'Create GearForge Account'}
                </h2>
                <p className="text-xs text-zinc-400">
                  {isLoginMode 
                    ? 'Enter your credentials to access your GearForge cloud setup.' 
                    : 'Register your account to save loadouts and custom PC builds.'}
                </p>
              </div>

              <form onSubmit={handleStandardAuth} className="space-y-3.5">
                {!isLoginMode && (
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-primary-400 uppercase tracking-wider block">
                      Gamer Handle / Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. CyberGamer_PH"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-primary-400 transition"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider block">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-primary-400 transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider block">
                    Password (Min 6 chars) *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-primary-400 transition"
                  />
                </div>

                {error && (
                  <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-red-500/15 border border-red-500/40 rounded-xl flex items-start gap-2.5 text-xs text-red-200">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                    <div>
                      <p className="font-bold">Account Notice</p>
                      <p className="text-[11px] leading-tight text-red-300 mt-0.5">{error}</p>
                    </div>
                  </motion.div>
                )}

                {success && (
                  <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-emerald-500/15 border border-emerald-500/40 rounded-xl flex items-center gap-2 text-xs text-emerald-200">
                    <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                    <p className="font-bold">{success}</p>
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-primary-500 hover:bg-primary-400 text-black font-extrabold rounded-xl text-sm transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-primary-500/20 cursor-pointer mt-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <div className="flex items-center gap-2">
                      <UserPlus className="w-4 h-4" />
                      <span>{isLoginMode ? 'Sign In to GearForge' : 'Create GearForge Account'}</span>
                    </div>
                  )}
                </button>

                <div className="relative flex items-center py-1">
                  <div className="flex-grow border-t border-white/10"></div>
                  <span className="flex-shrink-0 mx-3 text-[10px] text-zinc-500 uppercase font-extrabold tracking-widest">or sign in with</span>
                  <div className="flex-grow border-t border-white/10"></div>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="py-2.5 px-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    <span>Google</span>
                  </button>
                </div>
                <p className="text-[10px] text-zinc-500 text-center pt-1">
                  By logging in with Google, you agree to our Terms & Privacy Policy and OAuth compliance standards.
                </p>
              </form>

              <div className="text-center pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setIsLoginMode(!isLoginMode);
                    setError(null);
                    setSuccess(null);
                  }}
                  className="text-xs text-primary-400 hover:text-primary-300 font-bold transition cursor-pointer"
                >
                  {isLoginMode ? "Need an account? Create GearForge Account" : "Already registered? Sign in here"}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

