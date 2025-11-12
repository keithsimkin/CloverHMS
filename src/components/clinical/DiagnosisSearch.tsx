/**
 * DiagnosisSearch Component
 * Searchable dropdown for selecting diagnoses with ICD-10 codes and recording fields
 * Requirements: 13.2, 13.3, 13.5, 13.6
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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { generateMockDiagnoses } from '@/lib/mockData';
import { DiagnosisSeverity, DiagnosisStatus } from '@/types/enums';
import type { Diagnosis } from '@/types/models';

interface DiagnosisRecording {
  diagnosis: Diagnosis;
  severity: DiagnosisSeverity;
  status: DiagnosisStatus;
  clinical_notes: string;
}

interface DiagnosisSearchProps {
  value?: string;
  recording?: Partial<DiagnosisRecording>;
  onSelect: (diagnosis: Diagnosis | null) => void;
  onRecordingChange?: (recording: Partial<DiagnosisRecording>) => void;
  placeholder?: string;
  disabled?: boolean;
  showRecordingFields?: boolean;
}

export function DiagnosisSearch({
  value,
  recording,
  onSelect,
  onRecordingChange,
  placeholder = 'Search diagnoses...',
  disabled = false,
  showRecordingFields = true,
}: DiagnosisSearchProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - will be replaced with real API call
  const diagnoses = useMemo(() => generateMockDiagnoses(20), []);

  const selectedDiagnosis = useMemo(
    () => diagnoses.find((diagnosis) => diagnosis.id === value),
    [diagnoses, value]
  );

  const filteredDiagnoses = useMemo(() => {
    if (!searchQuery) return diagnoses;
    
    const query = searchQuery.toLowerCase();
    return diagnoses.filter(
      (diagnosis) =>
        diagnosis.diagnosis_name.toLowerCase().includes(query) ||
        diagnosis.diagnosis_code.toLowerCase().includes(query) ||
        diagnosis.icd10_category.toLowerCase().includes(query) ||
        diagnosis.description.toLowerCase().includes(query)
    );
  }, [diagnoses, searchQuery]);

  const handleSelect = (diagnosisId: string) => {
    const diagnosis = diagnoses.find((d) => d.id === diagnosisId);
    onSelect(diagnosis || null);
    setOpen(false);
  };

  const handleClear = () => {
    onSelect(null);
    if (onRecordingChange) {
      onRecordingChange({
        severity: undefined,
        status: undefined,
        clinical_notes: '',
      });
    }
  };

  const handleSeverityChange = (severity: DiagnosisSeverity) => {
    if (onRecordingChange && selectedDiagnosis) {
      onRecordingChange({
        ...recording,
        diagnosis: selectedDiagnosis,
        severity,
      });
    }
  };

  const handleStatusChange = (status: DiagnosisStatus) => {
    if (onRecordingChange && selectedDiagnosis) {
      onRecordingChange({
        ...recording,
        diagnosis: selectedDiagnosis,
        status,
      });
    }
  };

  const handleNotesChange = (notes: string) => {
    if (onRecordingChange && selectedDiagnosis) {
      onRecordingChange({
        ...recording,
        diagnosis: selectedDiagnosis,
        clinical_notes: notes,
      });
    }
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
            {selectedDiagnosis ? (
              <span className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs font-mono">
                  {selectedDiagnosis.diagnosis_code}
                </Badge>
                <span className="truncate">{selectedDiagnosis.diagnosis_name}</span>
              </span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[600px] p-0" align="start">
          <Command shouldFilter={false}>
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <CommandInput
                placeholder="Search by ICD-10 code, name, or category..."
                value={searchQuery}
                onValueChange={setSearchQuery}
                className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <CommandList>
              <CommandEmpty>No diagnoses found.</CommandEmpty>
              <CommandGroup>
                <ScrollArea className="h-[350px]">
                  {filteredDiagnoses.map((diagnosis) => (
                    <CommandItem
                      key={diagnosis.id}
                      value={diagnosis.id}
                      onSelect={handleSelect}
                      className="flex items-start gap-2 py-3"
                    >
                      <Check
                        className={cn(
                          'mt-1 h-4 w-4 shrink-0',
                          value === diagnosis.id ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs font-mono">
                            {diagnosis.diagnosis_code}
                          </Badge>
                          <span className="font-medium">{diagnosis.diagnosis_name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Category: {diagnosis.icd10_category}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {diagnosis.description}
                        </p>
                      </div>
                    </CommandItem>
                  ))}
                </ScrollArea>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedDiagnosis && (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="font-mono">
                    {selectedDiagnosis.diagnosis_code}
                  </Badge>
                  <CardTitle className="text-lg">{selectedDiagnosis.diagnosis_name}</CardTitle>
                </div>
                <CardDescription>
                  <span className="text-sm">ICD-10 Category: {selectedDiagnosis.icd10_category}</span>
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
            <div>
              <h4 className="text-sm font-medium mb-1">Description</h4>
              <p className="text-sm text-muted-foreground">
                {selectedDiagnosis.description}
              </p>
            </div>

            {showRecordingFields && (
              <>
                <Separator />
                
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold">Diagnosis Recording</h4>
                  
                  {/* Severity Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="severity">Severity *</Label>
                    <Select
                      value={recording?.severity}
                      onValueChange={handleSeverityChange}
                      disabled={disabled}
                    >
                      <SelectTrigger id="severity">
                        <SelectValue placeholder="Select severity level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={DiagnosisSeverity.MILD}>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500" />
                            Mild
                          </div>
                        </SelectItem>
                        <SelectItem value={DiagnosisSeverity.MODERATE}>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-yellow-500" />
                            Moderate
                          </div>
                        </SelectItem>
                        <SelectItem value={DiagnosisSeverity.SEVERE}>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-red-500" />
                            Severe
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Status Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <Select
                      value={recording?.status}
                      onValueChange={handleStatusChange}
                      disabled={disabled}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select diagnosis status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={DiagnosisStatus.SUSPECTED}>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">Suspected</Badge>
                            <span className="text-xs text-muted-foreground">
                              Preliminary diagnosis pending confirmation
                            </span>
                          </div>
                        </SelectItem>
                        <SelectItem value={DiagnosisStatus.CONFIRMED}>
                          <div className="flex items-center gap-2">
                            <Badge variant="default">Confirmed</Badge>
                            <span className="text-xs text-muted-foreground">
                              Diagnosis confirmed through tests/examination
                            </span>
                          </div>
                        </SelectItem>
                        <SelectItem value={DiagnosisStatus.RESOLVED}>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">Resolved</Badge>
                            <span className="text-xs text-muted-foreground">
                              Condition has been successfully treated
                            </span>
                          </div>
                        </SelectItem>
                        <SelectItem value={DiagnosisStatus.CHRONIC}>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">Chronic</Badge>
                            <span className="text-xs text-muted-foreground">
                              Long-term condition requiring ongoing management
                            </span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Clinical Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="clinical-notes">Clinical Notes</Label>
                    <Textarea
                      id="clinical-notes"
                      placeholder="Enter clinical observations, reasoning, and additional notes..."
                      value={recording?.clinical_notes || ''}
                      onChange={(e) => handleNotesChange(e.target.value)}
                      disabled={disabled}
                      rows={4}
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground">
                      Document clinical reasoning, associated symptoms, and treatment plan
                    </p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
