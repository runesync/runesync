"use client";

import {useState, useEffect} from "react";
import {useRouter, usePathname} from "next/navigation";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Users, Trophy, Settings} from "lucide-react";

const groupModes = [
    {id: "competitive", name: "Competitive", icon: <Trophy className="w-6 h-6 text-yellow-500"/>},
    {id: "regular", name: "Regular", icon: <Users className="w-6 h-6 text-blue-500"/>},
    {id: "custom", name: "Custom", icon: <Settings className="w-6 h-6 text-gray-500"/>},
];

const groupSizes = [2, 3, 4, 5]; // Allowed group sizes

export default function GroupModeSelector() {
    const router = useRouter();
    const pathname = usePathname();
    const [selectedMode, setSelectedMode] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<number | null>(null);

    // Extract mode from the URL (e.g., /groups/[mode])
    useEffect(() => {
        const pathParts = pathname.split("/").filter(Boolean); // Remove empty parts
        if (pathParts.length >= 2 && pathParts[0] === "groups") {
            const modeFromUrl = pathParts[1];
            if (groupModes.some((mode) => mode.id === modeFromUrl)) {
                setSelectedMode(modeFromUrl);
            }
        }
    }, [pathname]);

    const handleModeSelect = (mode: string) => {
        setSelectedMode(mode);
        setSelectedSize(null); // Reset size selection when mode changes
        router.push(`/groups/${mode}`); // Ensure navigation updates
    };

    const handleSizeSelect = (size: number) => {
        if (!selectedMode) return;
        setSelectedSize(size);
        router.push(`/groups/${selectedMode}/${size}`);
    };

    return (
        <div className="container mx-auto p-6 flex flex-col items-center">
            <h1 className="text-2xl font-bold text-primary mb-6">Select a Group Mode</h1>

            {/* Mode Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl">
                {groupModes.map((mode) => (
                    <Card
                        key={mode.id}
                        className={`cursor-pointer transition-transform hover:scale-105 ${
                            selectedMode === mode.id ? "border-2 border-primary shadow-lg" : ""
                        }`}
                        onClick={() => handleModeSelect(mode.id)}
                    >
                        <CardHeader className="flex flex-col items-center gap-2">
                            <>
                                {mode.icon}
                            </>
                            <CardTitle className="text-lg">{mode.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-center">
                            <Button variant="outline" className="w-full cursor-pointer">
                                {selectedMode === mode.id ? "Selected" : "Select"}
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Group Size Selection */}
            {selectedMode && (
                <>
                    <h2 className="text-xl font-semibold mt-8 text-primary">Select Group Size</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-4">
                        {groupSizes.map((size) => (
                            <Button
                                key={size}
                                variant={selectedSize === size ? "default" : "outline"}
                                className="w-16 h-16 text-lg font-bold cursor-pointer"
                                onClick={() => handleSizeSelect(size)}
                            >
                                {size}
                            </Button>
                        ))}
                    </div>
                </>
            )}

        </div>
    );
}