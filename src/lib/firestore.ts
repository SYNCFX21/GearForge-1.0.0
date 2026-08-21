import { db, auth } from './firebase';
import { collection, doc, setDoc, getDocs, query, deleteDoc, orderBy } from 'firebase/firestore';
import { SavedLoadout, UserProfile, Report } from '../types';

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
  }
};

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

export const saveLoadoutToFirestore = async (userId: string, loadout: SavedLoadout) => {
  const path = `users/${userId}/loadouts/${loadout.id}`;
  try {
    const loadoutRef = doc(db, 'users', userId, 'loadouts', loadout.id);
    await setDoc(loadoutRef, loadout);
  } catch (error) {
    console.warn('GearForgeDB loadout save notice:', error);
  }
};

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

export const deleteLoadoutFromFirestore = async (userId: string, loadoutId: string) => {
  const path = `users/${userId}/loadouts/${loadoutId}`;
  try {
    const loadoutRef = doc(db, 'users', userId, 'loadouts', loadoutId);
    await deleteDoc(loadoutRef);
  } catch (error) {
    console.warn('GearForgeDB loadout delete notice:', error);
  }
};

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

export const submitReportToFirestore = async (report: Report) => {
  try {
    const reportRef = doc(db, 'reports', report.id);
    await setDoc(reportRef, report);
  } catch (error) {
    console.warn('GearForgeDB submit report notice:', error);
  }
};

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

export const updateReportStatusInFirestore = async (reportId: string, status: Report['status']) => {
  try {
    const reportRef = doc(db, 'reports', reportId);
    await setDoc(reportRef, { status }, { merge: true });
  } catch (error) {
    console.warn('GearForgeDB update report status notice:', error);
  }
};
