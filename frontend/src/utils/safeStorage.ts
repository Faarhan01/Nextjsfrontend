/**
 * Safe LocalStorage and SessionStorage wrappers for Next.js / SSR compatibility.
 * Prevents hydration mismatches and unhandled SecurityError / QuotaExceededError crashes.
 */

export const safeLocalStorage = {
  getItem: <T = string>(key: string, defaultValue: T | null = null): T | string | null => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) return defaultValue;
      try {
        return JSON.parse(item) as T;
      } catch {
        return item as unknown as T;
      }
    } catch (err) {
      console.warn(`[safeLocalStorage] Failed to getItem('${key}'):`, err);
      return defaultValue;
    }
  },

  setItem: (key: string, value: any): boolean => {
    if (typeof window === 'undefined') return false;
    try {
      const serialized = typeof value === 'string' ? value : JSON.stringify(value);
      window.localStorage.setItem(key, serialized);
      return true;
    } catch (err) {
      console.warn(`[safeLocalStorage] Failed to setItem('${key}'):`, err);
      return false;
    }
  },

  removeItem: (key: string): boolean => {
    if (typeof window === 'undefined') return false;
    try {
      window.localStorage.removeItem(key);
      return true;
    } catch (err) {
      console.warn(`[safeLocalStorage] Failed to removeItem('${key}'):`, err);
      return false;
    }
  },

  clear: (): boolean => {
    if (typeof window === 'undefined') return false;
    try {
      window.localStorage.clear();
      return true;
    } catch (err) {
      console.warn('[safeLocalStorage] Failed to clear():', err);
      return false;
    }
  }
};
