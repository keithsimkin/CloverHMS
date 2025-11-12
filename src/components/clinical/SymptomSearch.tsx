/**
 * SymptomSearch Component
 * Searchable dropdown for selecting symptoms with details display
 * Requirements: 11.2
 */

import { useState, useMemo } from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { generateMockSymptoms } from '@/lib/mockData';
import type { Symptom } from '@/types/models';

interface SymptomSearchProps {
  value?: string;
  onSelect: (symptom: Symptom | null) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function SymptomSearch({
  value,
  onSelect,
  placeholder = 'Search symptoms...',
  disabled = false,
}: SymptomSearchProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - will be replaced with real API call
  const symptoms = useMemo(() => generateMockSymptoms(20), []);

  const selectedSymptom = useMemo(
    () => symptoms.find((symptom) => symptom.id === value),
    [symptoms, value]
  );

  const filteredSymptoms = useMemo(() => {
    if (!searchQuery) return symptoms;
    
    const query = searchQuery.toLowerCase();
    return symptoms.filter(
      (symptom) =>
        symptom.symptom_name.toLowerCase().includes(query) ||
        symptom.category.toLowerCase().includes(query) ||
        symptom.body_system.toLowerCase().includes(query)
    );
  }, [symptoms, searchQuery]);

  const handleSelect = (symptomId: string) => {
    const symptom = symptoms.find((s) => s.id === symptomId);
    onSelect(symptom || null);
    setOpen(false);
  };

  const handleClear = () => {
    onSelect(null);
  };

  return (
    <div className="space-y-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled}
          >
            {selectedSymptom ? (
              <span className="flex items-center gap-2">
                <span>{selectedSymptom.symptom_name}</span>
                <Badge variant="secondary" className="text-xs">
                  {selectedSymptom.category}
                </Badge>
              </span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <Command shouldFilter={false}>
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <CommandInput
                placeholder="Search by name, category, or body system..."
                value={searchQuery}
                onValueChange={setSearchQuery}
                className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <CommandList>
              <CommandEmpty>No symptoms found.</CommandEmpty>
              <CommandGroup>
                {filteredSymptoms.map((symptom) => (
                  <CommandItem
                    key={symptom.id}
                    value={symptom.id}
                    onSelect={handleSelect}
                    className="flex items-start gap-2 py-3"
                  >
                    <Check
                      className={cn(
                        'mt-1 h-4 w-4 shrink-0',
                        value === symptom.id ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{symptom.symptom_name}</span>
                        <Badge variant="outline" className="text-xs">
                          {symptom.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {symptom.body_system}
                      </p>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedSymptom && (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg">{selectedSymptom.symptom_name}</CardTitle>
                <CardDescription>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary">{selectedSymptom.category}</Badge>
                    <span className="text-sm">{selectedSymptom.body_system}</span>
                  </div>
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                disabled={disabled}
              >
                Clear
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="text-sm font-medium mb-1">Description</h4>
              <p className="text-sm text-muted-foreground">
                {selectedSymptom.description}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Severity Levels</h4>
              <div className="flex flex-wrap gap-2">
                {selectedSymptom.severity_levels.map((level) => (
                  <Badge key={level} variant="outline">
                    {level}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
