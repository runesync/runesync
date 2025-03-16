"use client";

import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { useXpToggleStore } from "@/stores/use-xp-toggle-store";

export default function XpToggle({
                                     showXP: externalShowXP, // Optional external state
                                     setShowXP: externalSetShowXP, // Optional external setter
                                     enablePersist = false, // Default: No persistence
                                     storageKey, // Required only if enablePersist is true
                                 }: {
    showXP?: boolean;
    setShowXP?: (val: boolean) => void;
    enablePersist?: boolean;
    storageKey?: string;
}) {
    // Validate that storageKey is provided when persistence is enabled
    if (enablePersist && !storageKey) {
        throw new Error("XpToggle: `storageKey` is required when `enablePersist` is true.");
    }

    // Zustand state (only used if persistence is enabled)
    const zustandXpToggle = useXpToggleStore((state) => (storageKey ? state.toggles[storageKey] : undefined));
    const setZustandXpToggle = useXpToggleStore((state) => state.setXpToggles);

    // Local state (used when no external or persistent state is provided)
    const [localXp, setLocalXp] = useState<boolean>(false);

    // Determine the current XP state
    const showXP = externalShowXP ?? (enablePersist ? zustandXpToggle ?? false : localXp);
    const setShowXP = (value: boolean) => {
        if (externalSetShowXP) {
            externalSetShowXP(value);
        } else if (enablePersist && storageKey) {
            setZustandXpToggle(storageKey, value);
        } else {
            setLocalXp(value);
        }
    };

    // Ensure Zustand initializes state only when needed
    useEffect(() => {
        if (enablePersist && storageKey && zustandXpToggle === undefined) {
            setZustandXpToggle(storageKey, false);
        }
    }, [enablePersist, storageKey, zustandXpToggle, setZustandXpToggle]);

    return (
        <div className="flex items-center gap-2">
            <span>Show XP</span>
            <Switch checked={showXP} onCheckedChange={setShowXP} className="cursor-pointer" />
        </div>
    );
}
