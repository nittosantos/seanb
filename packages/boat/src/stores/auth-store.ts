'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserType {
  name?: string;
  avatar?: string;
  role?: string;
}

const demoUser: UserType = {
  name: 'Jhon Doe',
  avatar:
    'http://s3.amazonaws.com/redqteam.com/isomorphic-reloaded-image/profilepic.png',
  role: 'admin',
};

interface AuthState {
  isAuthorized: boolean;
  user: Partial<UserType>;
  authorize: () => void;
  unauthorize: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthorized: false,
      user: {},
      authorize: () => set({ isAuthorized: true, user: demoUser }),
      unauthorize: () => set({ isAuthorized: false, user: {} }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthorized: state.isAuthorized,
        user: state.user,
      }),
    }
  )
);
