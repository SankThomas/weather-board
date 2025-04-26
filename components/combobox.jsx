"use client";

import { useState, useEffect } from "react";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import cities from "@/lib/cities.json";

export default function CityCombobox({ onSelect }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-60 lg:w-80">
          {selected ? selected.name : "Select a city"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full bg-neutral-900 p-0 text-white sm:w-[300px]">
        <Command>
          <CommandInput
            placeholder="Search for a city"
            value={search}
            onValueChange={setSearch}
          />
          <ScrollArea className="h-72">
            <CommandList>
              {filteredCities.map((city, index) => (
                <CommandItem
                  key={index}
                  onSelect={() => {
                    setSelected(city);
                    onSelect(city); // pass city to parent
                    setOpen(false);
                  }}
                >
                  {city.name}
                </CommandItem>
              ))}
            </CommandList>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
