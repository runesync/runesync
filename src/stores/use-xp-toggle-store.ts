import { create } from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";

// Zustand store with persistence for XP toggles
interface XpToggleStore {
    toggles: Record<string, boolean>
    setXpToggles: (key: string, value: boolean) => void;
}

export const useXpToggleStore = create<XpToggleStore>()(
    persist(
        (set, get) => ({
            toggles: {}, // Initialize as empty object
            setXpToggles: (key, value) =>
                set((state) => ({
                    toggles: { ...state.toggles, [key]: value },
                })),
        }),
        {
            name: "xp-toggle-storage", // Local storage key
            storage: createJSONStorage(() => localStorage), // Ensures it persists across refreshes
        }
    )
);
