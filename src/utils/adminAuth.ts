/**
 * Admin Authentication & Session Management
 * Al-Maktabah Al-Islamiyyah
 */

import { AdminUser } from '../types/cms';

const ADMIN_STORAGE_KEY = 'maktabah_admin_session_v1';

export const DEFAULT_ADMIN: AdminUser = {
  name: 'Jundi Abdul Syahid, S.Pd.',
  email: 'jundialihsan@gmail.com',
  role: 'admin',
  authenticated: true,
  lastLogin: new Date().toISOString(),
};

export const adminAuth = {
  getCurrentUser(): AdminUser {
    try {
      const data = localStorage.getItem(ADMIN_STORAGE_KEY);
      if (!data) {
        // By default initialize with verified admin session for the app owner
        this.setSession(DEFAULT_ADMIN);
        return DEFAULT_ADMIN;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_ADMIN;
    }
  },

  setSession(user: AdminUser) {
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(user));
  },

  loginAsAdmin(email?: string): AdminUser {
    const user: AdminUser = {
      name: 'Jundi Abdul Syahid, S.Pd.',
      email: email || 'jundialihsan@gmail.com',
      role: 'admin',
      authenticated: true,
      lastLogin: new Date().toISOString(),
    };
    this.setSession(user);
    return user;
  },

  switchRole(role: 'admin' | 'viewer'): AdminUser {
    const current = this.getCurrentUser();
    const updated: AdminUser = {
      ...current,
      role,
      authenticated: role === 'admin',
    };
    this.setSession(updated);
    return updated;
  },

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user.authenticated && user.role === 'admin';
  },

  logout(): AdminUser {
    const viewer: AdminUser = {
      name: 'Tamu / Penuntut Ilmu',
      email: 'guest@maktabah.local',
      role: 'viewer',
      authenticated: false,
    };
    this.setSession(viewer);
    return viewer;
  },
};
