export type CategoryType = 'mouse' | 'keyboard' | 'headset' | 'mousepad' | 'mic' | 'monitor' | 'controller' | 'speakers';

export interface PurchaseLink {
  storeName: 'Shopee' | 'Lazada' | 'Datablitz' | 'EasyPC' | 'PC Express' | 'Dynaquest' | 'Bermor Zone' | 'Official Website';
  url: string;
}

export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
  tagline?: string;
}

export interface Accessory {
  id: string;
  name: string;
  brand: string;
  category: CategoryType;
  pricePhp: number;
  description: string;
  specs: string[];
  links: PurchaseLink[];
  rating: number;
  tier: 'budget' | 'midrange' | 'premium' | 'enthusiast';
  imageUrl?: string;
  isWireless: boolean;
  reviews?: Review[];
  communitySentiment?: string;
}

export interface BudgetTier {
  id: string;
  name: string;
  minPrice: number;
  maxPrice: number;
  description: string;
  tagline: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
}

export interface PlaystylePreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  distribution: Record<CategoryType, number>; // percentages summing to 100
}

export interface SavedLoadout {
  id: string;
  name: string;
  budget: number;
  playstyle: string;
  accessories: Accessory[];
  createdAt: string;
  notes?: string;
}

export type UserRole = 'super_admin' | 'admin' | 'user';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  providerId: 'google.com' | 'password' | 'firebase';
  registeredAt: string;
  createdAtMs?: number;
  isVip?: boolean;
  vipTierName?: string;
  hasPermanentAdFree?: boolean;
  isTrialActive?: boolean;
  trialEndsAt?: string;
  vipExpiresAt?: string;

  // Role hierarchy
  role?: UserRole;

  // Moderation status
  isMuted?: boolean;
  mutedUntil?: string; // MM/DD/YYYY
  isSuspended?: boolean;
  suspendedUntil?: string; // MM/DD/YYYY
  isBanned?: boolean;
  banReason?: string;
  hasAcceptedRules?: boolean;
}

export interface Report {
  id: string;
  reporterUid: string;
  reporterName: string;
  reportedItemId: string; // The ID of the review/post
  reportedItemType: 'review' | 'post';
  reportedContent: string;
  reportedUser?: string; // The person who made the review/post
  reason: string;
  createdAt: string;
  status: 'pending' | 'reviewed' | 'dismissed';
}

export interface BugReport {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved';
  createdAt: number;
}

export interface AICustomPlannerRequest {
  budget: number;
  preferences: string;
  requiredCategories: CategoryType[];
  playstyle: string;
}

export interface AICustomPlannerResponse {
  loadoutName: string;
  totalCostPhp: number;
  rationale: string;
  items: {
    category: CategoryType;
    name: string;
    brand: string;
    pricePhp: number;
    description: string;
    storeSearchLinks: {
      storeName: string;
      url: string;
    }[];
  }[];
}

export type PCPartCategory = 'cpu' | 'motherboard' | 'gpu' | 'ram' | 'storage' | 'case' | 'psu' | 'cooler';

export interface AIPCBuildRequest {
  budget: number;
  preferences: string;
  resolution: string; // e.g. 1080p, 1440p, 4K
}

export interface AIPCBuildResponse {
  buildName: string;
  totalCostPhp: number;
  rationale: string;
  estimatedFps1080p?: string;
  parts: {
    category: PCPartCategory;
    name: string;
    brand: string;
    pricePhp: number;
    description: string;
    storeSearchLinks: {
      storeName: string;
      url: string;
    }[];
  }[];
}
