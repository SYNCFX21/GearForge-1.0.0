import { db, auth } from './firebase';
import { collection, doc, setDoc, getDocs, query, deleteDoc, orderBy } from 'firebase/firestore';
import { SavedLoadout, UserProfile, Report, BugReport } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  };
}

/**
 * Formats and logs Firestore permission and operational errors with context.
 * 
 * @param error - Caught error object or message
 * @param operationType - Type of database operation (create, update, read, etc.)
 * @param path - Firestore path of document/collection
 */
function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
    },
    operationType,
    path
  };
  console.error('GearForgeDB Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Creates or updates a user profile document in Firestore (`users/{userId}`).
 * Also handles private contact email separation in `users/{userId}/private/contact`.
 * 
 * @param userId - Unique user ID from Firebase Authentication
 * @param profile - User profile object
 * 
 * @whereUsed
 * - `src/components/AuthGate.tsx` (on user registration or sign-in)
 * - `src/components/UserProfileModal.tsx` (when user edits display name, bio, or avatar)
 */
export const saveUserProfileToGearForgeDB = async (userId: string, profile: UserProfile) => {
  const path = `users/${userId}`;
  try {
    const { getDoc } = await import('firebase/firestore');
    const userRef = doc(db, 'users', userId);
    
    // Check if user already exists
    const existingSnap = await getDoc(userRef);
    const isNewUser = !existingSnap.exists();
    
    let roleToSave = profile.role;
    
    if (!roleToSave && isNewUser) {
      roleToSave = 'user';
    }

    const { email, ...publicProfile } = profile;
    const dataToSave: any = {
      ...publicProfile,
      database: 'GearForgeDB',
      updatedAt: new Date().toISOString()
    };
    
    if (roleToSave) {
      dataToSave.role = roleToSave;
    }
    
    // Ensure new users get default fields to satisfy Firestore create rules
    if (isNewUser) {
      dataToSave.role = dataToSave.role || 'user';
      dataToSave.isVip = dataToSave.isVip ?? false;
      dataToSave.hasPermanentAdFree = dataToSave.hasPermanentAdFree ?? false;
      dataToSave.isMuted = dataToSave.isMuted ?? false;
    } else {
      // Don't overwrite privileged fields for existing users to prevent update rule denial
      delete dataToSave.role;
      delete dataToSave.isVip;
      delete dataToSave.hasPermanentAdFree;
      delete dataToSave.isMuted;
      delete dataToSave.mutedUntil;
    }

    await setDoc(userRef, dataToSave, { merge: true });

    if (email) {
      await setDoc(doc(db, 'users', userId, 'private', 'contact'), {
        email,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }
  } catch (error) {
    console.warn('GearForgeDB Firestore user save notice:', error);
    throw error;
  }
};

/**
 * Fetches a single user profile from Firestore by user ID.
 * 
 * @param userId - Target user ID
 * @returns {Promise<UserProfile | null>} The user profile object or null if not found.
 * 
 * @whereUsed
 * - `src/App.tsx` (loads authenticated user profile and VIP/admin roles)
 * - `src/components/UserProfileModal.tsx` (viewing other community members' profiles)
 */
export const getUserProfileFromFirestore = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { getDoc } = await import('firebase/firestore');
    const userRef = doc(db, 'users', userId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
  } catch (err) {
    console.warn('Failed to fetch user profile:', err);
  }
  return null;
};

/**
 * Retrieves all registered users from Firestore.
 * 
 * @returns {Promise<UserProfile[]>} Array of all user profiles.
 * 
 * @whereUsed
 * - `src/components/AdminPanelModal.tsx` (User Management tab for role assignment & moderation)
 * - `src/components/UserSearch.tsx` (Community member search modal)
 */
export const getAllUsersFromFirestore = async (): Promise<UserProfile[]> => {
  try {
    const q = query(collection(db, 'users'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as UserProfile);
  } catch (error) {
    console.warn('GearForgeDB users fetch notice:', error);
    return [];
  }
};

/**
 * Updates specific fields on an existing user document.
 * 
 * @param userId - Target user ID
 * @param updates - Partial object of updated user properties
 * 
 * @whereUsed
 * - `src/components/AdminPanelModal.tsx` (promoting users, assigning VIP, muting/unmuting)
 */
export const updateUserInFirestore = async (userId: string, updates: Partial<UserProfile>) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.warn('GearForgeDB user update notice:', error);
  }
};

/**
 * Saves a custom loadout build to the user's private subcollection (`users/{userId}/loadouts/{loadoutId}`).
 * 
 * @param userId - Owner user ID
 * @param loadout - Saved loadout object containing gear list, budget, and metadata
 * 
 * @whereUsed
 * - `src/App.tsx` (saving loadouts generated from Budget Calculator, AI Planner, or PC Builder)
 */
export const saveLoadoutToFirestore = async (userId: string, loadout: SavedLoadout) => {
  const path = `users/${userId}/loadouts/${loadout.id}`;
  try {
    const loadoutRef = doc(db, 'users', userId, 'loadouts', loadout.id);
    await setDoc(loadoutRef, loadout);
  } catch (error) {
    console.warn('GearForgeDB loadout save notice:', error);
  }
};

/**
 * Fetches all saved loadouts for a user, ordered chronologically by newest first.
 * 
 * @param userId - User ID whose loadouts should be fetched
 * @returns {Promise<SavedLoadout[]>} Array of saved loadouts
 * 
 * @whereUsed
 * - `src/App.tsx` (populating "My Saved Builds" drawer)
 * - `src/components/UserProfileModal.tsx` (displaying public builds created by a community member)
 */
export const getLoadoutsFromFirestore = async (userId: string): Promise<SavedLoadout[]> => {
  const path = `users/${userId}/loadouts`;
  try {
    const q = query(
      collection(db, 'users', userId, 'loadouts'),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as SavedLoadout);
  } catch (error) {
    console.warn('GearForgeDB loadout fetch notice:', error);
    return [];
  }
};

/**
 * Deletes a specific saved loadout from the user's loadouts subcollection.
 * 
 * @param userId - Owner user ID
 * @param loadoutId - ID of loadout to delete
 * 
 * @whereUsed
 * - `src/App.tsx` (deleting a loadout from saved loadouts list)
 */
export const deleteLoadoutFromFirestore = async (userId: string, loadoutId: string) => {
  const path = `users/${userId}/loadouts/${loadoutId}`;
  try {
    const loadoutRef = doc(db, 'users', userId, 'loadouts', loadoutId);
    await deleteDoc(loadoutRef);
  } catch (error) {
    console.warn('GearForgeDB loadout delete notice:', error);
  }
};

/**
 * Deletes a user profile and cascades deletion to all their saved loadouts.
 * 
 * @param userId - User ID to delete
 * 
 * @whereUsed
 * - `src/components/AdminPanelModal.tsx` (Admin deleting banned/inappropriate accounts)
 * - `src/components/UserProfileModal.tsx` (Account deletion requested by user)
 */
export const deleteUserProfileFromGearForgeDB = async (userId: string) => {
  const path = `users/${userId}`;
  try {
    // Delete loadouts subcollection items
    const q = query(collection(db, 'users', userId, 'loadouts'));
    const snapshot = await getDocs(q);
    const deletePromises = snapshot.docs.map(docSnap => deleteDoc(docSnap.ref));
    await Promise.all(deletePromises);

    // Delete root user doc
    const userRef = doc(db, 'users', userId);
    await deleteDoc(userRef);
  } catch (error) {
    console.warn('GearForgeDB user deletion warning (offline or non-critical):', error);
  }
};

/**
 * Submits a community moderation report against inappropriate content or users.
 * 
 * @param report - Report details containing target, reason, and reporter metadata
 * 
 * @whereUsed
 * - `src/components/ItemReviewForum.tsx` (reporting inappropriate user reviews)
 * - `src/components/UserProfileModal.tsx` (reporting inappropriate user profiles)
 */
export const submitReportToFirestore = async (report: Report) => {
  try {
    const reportRef = doc(db, 'reports', report.id);
    await setDoc(reportRef, report);
  } catch (error) {
    console.warn('GearForgeDB submit report notice:', error);
  }
};

/**
 * Submits a user bug report or feedback ticket to the `bug_reports` collection.
 * 
 * @param report - Bug report details including category, description, and client info
 * 
 * @whereUsed
 * - `src/components/ReportBugModal.tsx` (when a user submits feedback or reports a bug)
 */
export const submitBugReport = async (report: BugReport): Promise<void> => {
  try {
    const reportRef = doc(db, 'bug_reports', report.id);
    await setDoc(reportRef, report);
  } catch (err) {
    console.error('Failed to submit bug report:', err);
    throw err;
  }
};

/**
 * Retrieves all bug reports and feedback tickets from Firestore ordered by newest first.
 * 
 * @returns {Promise<BugReport[]>} Array of bug reports
 * 
 * @whereUsed
 * - `src/components/BugReportsPanelModal.tsx` (Admin view of bug reports and feature requests)
 * - `src/components/AdminPanelModal.tsx` (Admin dashboard overview)
 */
export const getBugReportsFromFirestore = async (): Promise<BugReport[]> => {
  try {
    const { getDocs, query, orderBy, collection } = await import('firebase/firestore');
    const q = query(collection(db, 'bug_reports'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const reports: BugReport[] = [];
    snapshot.forEach(doc => {
      reports.push(doc.data() as BugReport);
    });
    return reports;
  } catch (err) {
    console.error('Failed to fetch bug reports:', err);
    return [];
  }
};

/**
 * Updates the resolution status of a bug report ticket ('open' | 'in-progress' | 'resolved').
 * 
 * @param reportId - Bug report ticket ID
 * @param status - New status to apply
 * 
 * @whereUsed
 * - `src/components/BugReportsPanelModal.tsx` (Admin triaging tickets)
 */
export const updateBugReportStatusInFirestore = async (reportId: string, status: 'open' | 'in-progress' | 'resolved'): Promise<void> => {
  try {
    const { updateDoc } = await import('firebase/firestore');
    const reportRef = doc(db, 'bug_reports', reportId);
    await updateDoc(reportRef, { status });
  } catch (err) {
    console.error('Failed to update bug report status:', err);
    throw err;
  }
};

/**
 * Retrieves all moderation reports from Firestore ordered by newest first.
 * 
 * @returns {Promise<Report[]>} Array of moderation reports
 * 
 * @whereUsed
 * - `src/components/AdminPanelModal.tsx` (Reports moderation tab)
 */
export const getReportsFromFirestore = async (): Promise<Report[]> => {
  try {
    const q = query(collection(db, 'reports'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Report);
  } catch (error) {
    console.warn('GearForgeDB fetch reports notice:', error);
    return [];
  }
};

/**
 * Updates the moderation status of a reported item ('pending' | 'resolved' | 'dismissed').
 * 
 * @param reportId - Report ID
 * @param status - Updated moderation status
 * 
 * @whereUsed
 * - `src/components/AdminPanelModal.tsx` (resolving or dismissing moderation flags)
 */
export const updateReportStatusInFirestore = async (reportId: string, status: Report['status']) => {
  try {
    const reportRef = doc(db, 'reports', reportId);
    await setDoc(reportRef, { status }, { merge: true });
  } catch (error) {
    console.warn('GearForgeDB update report status notice:', error);
  }
};
