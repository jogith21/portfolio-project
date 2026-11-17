import { INITIAL_STATE } from '../data/mockData';
import { WorkConnectState } from '../types';

const STORAGE_KEY = 'workconnect_platform_state_v1';

/**
 * Storage abstraction layer over localStorage.
 * Designed with clean repository methods so it can be replaced with
 * Supabase client calls without refactoring UI components.
 */
export const storageService = {
  loadState(): WorkConnectState {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        this.saveState(INITIAL_STATE);
        return INITIAL_STATE;
      }
      const parsed = JSON.parse(raw) as Partial<WorkConnectState>;
      return {
        ...INITIAL_STATE,
        ...parsed,
        settings: {
          ...INITIAL_STATE.settings,
          ...(parsed.settings ?? {}),
        },
      };
    } catch {
      return INITIAL_STATE;
    }
  },

  saveState(state: WorkConnectState): void {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors cleanly in restricted environments
    }
  },

  resetDemoData(): WorkConnectState {
    this.saveState(INITIAL_STATE);
    return INITIAL_STATE;
  },
};
