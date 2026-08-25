import React, { useState, useEffect, useRef } from 'react';
import { Search, User } from 'lucide-react';
import { UserProfile } from '../types';
import { getAllUsersFromFirestore } from '../lib/firestore';
import { MOCK_COMMUNITY_USERS } from './AdminPanelModal';

interface UserSearchProps {
  onUserSelect: (username: string) => void;
}

/**
 * UserSearch Component
 * Autocomplete search dropdown allowing users to find community members by username or email.
 * 
 * @whereUsed
 * - `src/App.tsx` (top navigation bar search input)
 */
export default function UserSearch({ onUserSelect }: UserSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch users when the component mounts so we have them ready
    const fetchUsers = async () => {
      const allUsers = await getAllUsersFromFirestore();
      
      const map = new Map<string, UserProfile>();
      allUsers.forEach(u => map.set(u.uid, u));
      
      MOCK_COMMUNITY_USERS.forEach(u => {
        if (!map.has(u.uid)) {
          map.set(u.uid, u);
        }
      });
      
      setUsers(Array.from(map.values()));
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredUsers = users.filter((u) => 
    u.displayName && u.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative z-50 w-full max-w-2xl" ref={containerRef}>
      <div className="relative">
        <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search gamers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          className="w-full bg-[var(--app-bg)]/40 border border-white/10 text-white pl-9 pr-3 py-2 rounded-xl text-xs focus:outline-none focus:border-primary-500 transition-colors"
        />
      </div>

      {/* Results Dropdown */}
      {isFocused && searchQuery.trim() !== '' && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#141821] border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-64 overflow-y-auto">
          {filteredUsers.length > 0 ? (
            <div className="p-1.5 space-y-0.5">
              {filteredUsers.map((user) => (
                <button
                  key={user.uid}
                  type="button"
                  onClick={() => {
                    onUserSelect(user.displayName);
                    setSearchQuery('');
                    setIsFocused(false);
                  }}
                  className="w-full flex items-center gap-3 p-2.5 hover:bg-white/5 rounded-xl transition text-left cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-zinc-400" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white leading-tight flex items-center gap-1.5">
                      {user.displayName}
                      {user.isVip && (
                        <span className="text-[8px] bg-primary-500/20 text-primary-400 border border-primary-500/40 px-1 py-0.5 rounded font-black uppercase tracking-wider">VIP</span>
                      )}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">Profile</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-xs text-zinc-500 font-mono">
              No gamers found matching "{searchQuery}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
