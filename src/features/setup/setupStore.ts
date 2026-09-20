import { create } from "zustand";
import { database } from "../../persistence/database";
import type { Attendance, Delegation, Session } from "../../lib/types";

const sessionId = "active-session";

function createDelegation(countryName: string, flagEmoji = ""): Delegation {
  return {
    id: crypto.randomUUID(),
    countryName,
    flagEmoji,
    attendance: "absent",
  };
}

function createEmptySession(): Session {
  const now = Date.now();
  return {
    id: sessionId,
    committeeName: "",
    agendaTopic: "",
    delegations: [],
    createdAt: now,
    updatedAt: now,
  };
}

type SetupState = {
  session: Session;
  isHydrated: boolean;
  hydrate: () => Promise<void>;
  updateSession: (changes: Partial<Session>) => void;
  addDelegation: (countryName: string, flagEmoji?: string) => void;
  addDelegationsFromText: (text: string) => void;
  removeDelegation: (id: string) => void;
  setAttendance: (id: string, attendance: Attendance) => void;
};

export const useSetupStore = create<SetupState>((set, get) => ({
  session: createEmptySession(),
  isHydrated: false,

  hydrate: async () => {
    const savedSession = await database.sessions.get(sessionId);
    set({ session: savedSession ?? createEmptySession(), isHydrated: true });
  },

  updateSession: (changes) => {
    set((state) => ({
      session: { ...state.session, ...changes, updatedAt: Date.now() },
    }));
    void database.sessions.put({
      ...get().session,
      ...changes,
      updatedAt: Date.now(),
    });
  },

  addDelegation: (countryName, flagEmoji) => {
    const cleanName = countryName.trim();
    if (!cleanName) return;
    const session = get().session;
    const updatedSession = {
      ...session,
      delegations: [...session.delegations, createDelegation(cleanName, flagEmoji)],
      updatedAt: Date.now(),
    };
    set({ session: updatedSession });
    void database.sessions.put(updatedSession);
  },

  addDelegationsFromText: (text) => {
    const names = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    if (!names.length) return;
    const session = get().session;
    const updatedSession = {
      ...session,
      delegations: [
        ...session.delegations,
        ...names.map((name) => createDelegation(name)),
      ],
      updatedAt: Date.now(),
    };
    set({ session: updatedSession });
    void database.sessions.put(updatedSession);
  },

  removeDelegation: (id) => {
    const session = get().session;
    const updatedSession = {
      ...session,
      delegations: session.delegations.filter((delegation) => delegation.id !== id),
      updatedAt: Date.now(),
    };
    set({ session: updatedSession });
    void database.sessions.put(updatedSession);
  },

  setAttendance: (id, attendance) => {
    const session = get().session;
    const updatedSession = {
      ...session,
      delegations: session.delegations.map((delegation) =>
        delegation.id === id ? { ...delegation, attendance } : delegation,
      ),
      updatedAt: Date.now(),
    };
    set({ session: updatedSession });
    void database.sessions.put(updatedSession);
  },
}));
