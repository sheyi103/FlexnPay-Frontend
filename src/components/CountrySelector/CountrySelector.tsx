"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { CircleFlag } from "react-circle-flags";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import type { Country } from "@/types";

interface CountrySelectorProps {
  selectedCountry: Country;
  onSelect: (country: Country) => void;
  countries: Country[];
}

export function CountrySelector({
  selectedCountry,
  onSelect,
  countries,
}: CountrySelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredCountries = searchTerm
    ? countries.filter(
        (country) =>
          country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          country.code.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : countries;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="justify-between w-auto px-3 border-l rounded-l-none"
        >
          <span className="flex items-center truncate">
            <CircleFlag
              countryCode={selectedCountry.flagCode}
              className="w-5 h-5 mr-2 shrink-0"
            />
            {selectedCountry.code}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <div className="p-2">
          <Input
            placeholder="Search country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {filteredCountries.length > 0 ? (
            filteredCountries.map((country) => (
              <div
                key={country.code}
                onClick={() => {
                  onSelect(country);
                  setOpen(false);
                  setSearchTerm("");
                }}
                className="flex items-center p-2 cursor-pointer hover:bg-accent"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedCountry.code === country.code
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                <CircleFlag
                  countryCode={country.flagCode}
                  className="w-5 h-5 mr-2"
                />
                <span className="truncate">
                  {country.name} ({country.code})
                </span>
              </div>
            ))
          ) : (
            <div className="p-2 text-sm text-center text-muted-foreground">
              No country found.
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
