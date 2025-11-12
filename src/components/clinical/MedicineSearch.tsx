/**
 * MedicineSearch Component
 * Searchable dropdown for selecting medicines with detailed information
 * Requirements: 12.5
 */

import { useState, useMemo } from 'react';
import { Check, ChevronsUpDown, Search, AlertTriangle } from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { generateMockMedicines } from '@/lib/mockData';
import type { Medicine } from '@/types/models';

interface MedicineSearchProps {
  value?: string;
  onSelect: (medicine: Medicine | null) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function MedicineSearch({
  value,
  onSelect,
  placeholder = 'Search medicines...',
  disabled = false,
}: MedicineSearchProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - will be replaced with real API call
  const medicines = useMemo(() => generateMockMedicines(30), []);

  const selectedMedicine = useMemo(
    () => medicines.find((medicine) => medicine.id === value),
    [medicines, value]
  );

  const filteredMedicines = useMemo(() => {
    if (!searchQuery) return medicines;
    
    const query = searchQuery.toLowerCase();
    return medicines.filter(
      (medicine) =>
        medicine.medicine_name.toLowerCase().includes(query) ||
        medicine.generic_name.toLowerCase().includes(query) ||
        medicine.therapeutic_category.toLowerCase().includes(query) ||
        medicine.brand_names.some((brand) => brand.toLowerCase().includes(query))
    );
  }, [medicines, searchQuery]);

  const handleSelect = (medicineId: string) => {
    const medicine = medicines.find((m) => m.id === medicineId);
    onSelect(medicine || null);
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
            {selectedMedicine ? (
              <span className="flex items-center gap-2">
                <span>{selectedMedicine.medicine_name}</span>
                <Badge variant="secondary" className="text-xs">
                  {selectedMedicine.therapeutic_category}
                </Badge>
              </span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[500px] p-0" align="start">
          <Command shouldFilter={false}>
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <CommandInput
                placeholder="Search by name, generic name, or category..."
                value={searchQuery}
                onValueChange={setSearchQuery}
                className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <CommandList>
              <CommandEmpty>No medicines found.</CommandEmpty>
              <CommandGroup>
                <ScrollArea className="h-[300px]">
                  {filteredMedicines.map((medicine) => (
                    <CommandItem
                      key={medicine.id}
                      value={medicine.id}
                      onSelect={handleSelect}
                      className="flex items-start gap-2 py-3"
                    >
                      <Check
                        className={cn(
                          'mt-1 h-4 w-4 shrink-0',
                          value === medicine.id ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{medicine.medicine_name}</span>
                          <Badge variant="outline" className="text-xs">
                            {medicine.therapeutic_category}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Generic: {medicine.generic_name}
                        </p>
                        {medicine.brand_names.length > 0 && (
                          <p className="text-xs text-muted-foreground">
                            Brands: {medicine.brand_names.slice(0, 2).join(', ')}
                          </p>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </ScrollArea>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedMedicine && (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg">{selectedMedicine.medicine_name}</CardTitle>
                <CardDescription>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm">Generic: {selectedMedicine.generic_name}</span>
                    <Badge variant="secondary">{selectedMedicine.therapeutic_category}</Badge>
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
          <CardContent className="space-y-4">
            {/* Brand Names */}
            {selectedMedicine.brand_names.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Brand Names</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMedicine.brand_names.map((brand) => (
                    <Badge key={brand} variant="outline">
                      {brand}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Dosage Forms */}
            <div>
              <h4 className="text-sm font-medium mb-2">Dosage Forms</h4>
              <div className="flex flex-wrap gap-2">
                {selectedMedicine.dosage_forms.map((form) => (
                  <Badge key={form} variant="secondary">
                    {form}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Strength Options */}
            <div>
              <h4 className="text-sm font-medium mb-2">Strength Options</h4>
              <div className="flex flex-wrap gap-2">
                {selectedMedicine.strength_options.map((strength) => (
                  <Badge key={strength} variant="secondary">
                    {strength}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* Contraindications */}
            {selectedMedicine.contraindications && selectedMedicine.contraindications.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  Contraindications
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {selectedMedicine.contraindications.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Side Effects */}
            {selectedMedicine.side_effects && selectedMedicine.side_effects.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Common Side Effects</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {selectedMedicine.side_effects.map((effect, index) => (
                    <li key={index}>{effect}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Drug Interactions */}
            {selectedMedicine.drug_interactions && selectedMedicine.drug_interactions.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  Drug Interactions
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMedicine.drug_interactions.map((drug) => (
                    <Badge key={drug} variant="outline" className="border-yellow-500">
                      {drug}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Storage Requirements */}
            {selectedMedicine.storage_requirements && (
              <div>
                <h4 className="text-sm font-medium mb-1">Storage Requirements</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedMedicine.storage_requirements}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
