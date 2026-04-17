import { createContext, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { storage, today } from '../utils/storage.js';
import { applyPhaseAdvance, evaluateNextPhase } from '../utils/phaseTransition.js';

const STORAGE_KEY = 'state';
const now = () => new Date().toISOString();

const initialState = {
  hydrated: false,
  profile: null,
  cycle: null,
  moods: [],
  journal: [],
  rituals: [],
  ritualCompletions: [],
  presence: {
    sessionStartTime: now(),
    checkInsToday: 0,
    appOpensToday: 1,
    lastNudgeAt: null,
    lastResetDate: today(),
  },
};

function reducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, ...action.payload, hydrated: true };

    case 'COMPLETE_ONBOARDING': {
      const { profile, cycle, rituals, firstMood } = action.payload;
      return {
        ...state,
        profile,
        cycle,
        rituals,
        moods: firstMood ? [firstMood] : state.moods,
      };
    }

    case 'ADD_MOOD':
      return {
        ...state,
        moods: [...state.moods, action.payload],
        presence: {
          ...state.presence,
          checkInsToday: state.presence.checkInsToday + 1,
        },
      };

    case 'ADD_JOURNAL':
      return { ...state, journal: [...state.journal, action.payload] };

    case 'UPDATE_JOURNAL': {
      const { id, patch } = action.payload;
      return {
        ...state,
        journal: state.journal.map((e) => (e.id === id ? { ...e, ...patch } : e)),
      };
    }

    case 'TOGGLE_RITUAL': {
      const { ritualId, date } = action.payload;
      const existing = state.ritualCompletions.find(
        (c) => c.ritualId === ritualId && c.date === date
      );
      if (existing) {
        return {
          ...state,
          ritualCompletions: state.ritualCompletions.filter(
            (c) => !(c.ritualId === ritualId && c.date === date)
          ),
        };
      }
      return {
        ...state,
        ritualCompletions: [
          ...state.ritualCompletions,
          { ritualId, date, completedAt: now() },
        ],
      };
    }

    case 'SET_RITUALS':
      return { ...state, rituals: action.payload };

    case 'ADVANCE_PHASE':
      if (!state.cycle) return state;
      return { ...state, cycle: applyPhaseAdvance(state.cycle, action.payload) };

    case 'SEED':
      return { ...state, ...action.payload };

    case 'RESET_PRESENCE_DAY':
      return {
        ...state,
        presence: {
          ...state.presence,
          checkInsToday: 0,
          appOpensToday: 1,
          lastNudgeAt: null,
          lastResetDate: today(),
        },
      };

    case 'RESTART_SESSION':
      return {
        ...state,
        presence: {
          ...state.presence,
          sessionStartTime: now(),
          appOpensToday: state.presence.appOpensToday + 1,
        },
      };

    case 'NUDGE_SHOWN':
      return {
        ...state,
        presence: { ...state.presence, lastNudgeAt: now() },
      };

    case 'RESET_ALL':
      return { ...initialState, hydrated: true, presence: { ...initialState.presence } };

    default:
      return state;
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const hydratedRef = useRef(false);

  useEffect(() => {
    const stored = storage.get(STORAGE_KEY);
    if (stored) {
      const presence = stored.presence ?? initialState.presence;
      const needsReset = presence.lastResetDate !== today();
      dispatch({
        type: 'HYDRATE',
        payload: {
          ...stored,
          presence: needsReset
            ? {
                ...presence,
                checkInsToday: 0,
                appOpensToday: 1,
                lastNudgeAt: null,
                lastResetDate: today(),
                sessionStartTime: now(),
              }
            : { ...presence, sessionStartTime: now() },
        },
      });
    } else {
      dispatch({ type: 'HYDRATE', payload: {} });
    }
    hydratedRef.current = true;
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    const { hydrated, ...persisted } = state;
    storage.set(STORAGE_KEY, persisted);
  }, [state]);

  useEffect(() => {
    if (!state.hydrated || !state.cycle) return;
    const next = evaluateNextPhase({
      cycle: state.cycle,
      moods: state.moods,
      journal: state.journal,
      rituals: state.rituals,
      ritualCompletions: state.ritualCompletions,
    });
    if (next && next !== state.cycle.phase) {
      dispatch({ type: 'ADVANCE_PHASE', payload: next });
    }
  }, [
    state.hydrated,
    state.cycle,
    state.moods,
    state.journal,
    state.rituals,
    state.ritualCompletions,
  ]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
