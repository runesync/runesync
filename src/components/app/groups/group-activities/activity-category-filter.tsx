"use client";

import {useState} from "react";
import {Check, ChevronsUpDown} from "lucide-react";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

const activityCategories = ["Skills", "Quests", "Kills", "Pets", "Drops"];

export default function ActivityCategoryFilter({
                                                   selectedCategories,
                                                   onSelect,
                                               }: {
    selectedCategories: string[];
    onSelect: (categories: string[]) => void;
}) {
    const [open, setOpen] = useState(false);

    const toggleCategory = (category: string) => {
        const updated = selectedCategories.includes(category)
            ? selectedCategories.filter((c) => c !== category)
            : [...selectedCategories, category];

        onSelect(updated);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-[200px] justify-between cursor-pointer">
                    {selectedCategories.length > 0 ? selectedCategories.join(", ") : "All Categories"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <>
                    <Command>
                        <CommandInput placeholder="Search categories..."/>
                        <CommandList>
                            <CommandEmpty>No categories found.</CommandEmpty>
                            <CommandGroup>
                                <>
                                    {activityCategories.map((category) => (
                                        <CommandItem
                                            key={category}
                                            value={category}
                                            onSelect={() => toggleCategory(category)}
                                            className="cursor-pointer"
                                        >
                                            <Check
                                                className={cn("mr-2 h-4 w-4", selectedCategories.includes(category) ? "opacity-100" : "opacity-0")}
                                            />
                                            {category}
                                        </CommandItem>
                                    ))}
                                </>
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </>
            </PopoverContent>
        </Popover>
    );
}
