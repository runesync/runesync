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
import {getSkillIcon} from '@/lib/utilities/icons';

export default function SkillFilter({
                                        skillNames,
                                        selectedSkills,
                                        onSelect,
                                    }: {
    skillNames: string[];
    selectedSkills: string[];
    onSelect: (skills: string[]) => void;
}) {
    const [open, setOpen] = useState(false);

    const toggleSkill = (skill: string) => {
        let updatedSkills;
        if (selectedSkills.includes(skill)) {
            updatedSkills = selectedSkills.filter((s) => s !== skill);
        } else {
            updatedSkills = [...selectedSkills, skill];
        }
        onSelect(updatedSkills);
    };

    const isAllSelected = selectedSkills.length === 0;
    const buttonText = isAllSelected
        ? "All Skills"
        : selectedSkills.length === 1
            ? selectedSkills[0]
            : `${selectedSkills.length} Selected`;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between cursor-pointer"
                >
                    {buttonText}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search skills..."/>
                    <CommandList>
                        <CommandEmpty>No skills found.</CommandEmpty>
                        <CommandGroup>
                            {/* Reset to "All Skills" */}
                            <CommandItem
                                key="all"
                                value="all"
                                onSelect={() => {
                                    onSelect([]); // Clears selection
                                    setOpen(false);
                                }}
                                className="cursor-pointer"
                            >
                                <Check className={cn("mr-2 h-4 w-4", isAllSelected ? "opacity-100" : "opacity-0")}/>
                                All Skills
                            </CommandItem>
                            <>
                                {skillNames.map((skill) => (
                                    <CommandItem
                                        key={skill}
                                        value={skill}
                                        onSelect={() => toggleSkill(skill)}
                                        className="cursor-pointer"
                                    >
                                        <Check
                                            className={cn("mr-2 h-4 w-4", selectedSkills.includes(skill) ? "opacity-100" : "opacity-0")}
                                        />
                                        <img src={getSkillIcon(skill)} alt={skill} className="w-6 h-6 mr-2"/>
                                        {skill}
                                    </CommandItem>
                                ))}
                            </>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
