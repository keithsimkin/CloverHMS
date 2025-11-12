/**
 * VisitSymptomRecording Component
 * Records symptoms during a patient visit with timestamp and user tracking
 * Requirements: 11.3, 11.4
 */

import { useState } from 'react';
import { Plus, Trash2, Clock, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { SymptomSearch } from './SymptomSearch';
import type { Symptom } from '@/types/models';

export interface RecordedSymptom {
  symptom: Symptom;
  severity: string;
  onset_date?: Date;
  notes?: string;
  recorded_at: Date;
  recorded_by: string;
}

interface VisitSymptomRecordingProps {
  symptoms: RecordedSymptom[];
  onSymptomsChange: (symptoms: RecordedSymptom[]) => void;
  currentUser?: string;
  disabled?: boolean;
}

export function VisitSymptomRecording({
  symptoms,
  onSymptomsChange,
  currentUser = 'Current User',
  disabled = false,
}: VisitSymptomRecordingProps) {
  const [selectedSymptom, setSelectedSymptom] = useState<Symptom | null>(null);
  const [severity, setSeverity] = useState<string>('');
  const [onsetDate, setOnsetDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const handleAddSymptom = () => {
    if (!selectedSymptom || !severity) {
      return;
    }

    const newSymptom: RecordedSymptom = {
      symptom: selectedSymptom,
      severity,
      onset_date: onsetDate ? new Date(onsetDate) : undefined,
      notes: notes || undefined,
      recorded_at: new Date(),
      recorded_by: currentUser,
    };

    onSymptomsChange([...symptoms, newSymptom]);

    // Reset form
    setSelectedSymptom(null);
    setSeverity('');
    setOnsetDate('');
    setNotes('');
  };

  const handleRemoveSymptom = (index: number) => {
    const updatedSymptoms = symptoms.filter((_, i) => i !== index);
    onSymptomsChange(updatedSymptoms);
  };

  return (
    <div className="space-y-6">
      {/* Add New Symptom */}
      <Card>
        <CardHeader>
          <CardTitle>Add Symptom</CardTitle>
          <CardDescription>Search and select a symptom to record</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Symptom Search */}
          <div className="space-y-2">
            <Label>Symptom *</Label>
            <SymptomSearch
              value={selectedSymptom?.id}
              onSelect={setSelectedSymptom}
              disabled={disabled}
            />
          </div>

          {selectedSymptom && (
            <>
              <Separator />

              {/* Severity Selection */}
              <div className="space-y-2">
                <Label htmlFor="severity">Severity *</Label>
                <Select
                  value={severity}
                  onValueChange={setSeverity}
                  disabled={disabled}
                >
                  <SelectTrigger id="severity">
                    <SelectValue placeholder="Select severity level" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedSymptom.severity_levels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Onset Date */}
              <div className="space-y-2">
                <Label htmlFor="onset_date">Onset Date</Label>
                <Input
                  id="onset_date"
                  type="date"
                  value={onsetDate}
                  onChange={(e) => setOnsetDate(e.target.value)}
                  disabled={disabled}
                  max={new Date().toISOString().split('T')[0]}
                />
                <p className="text-xs text-muted-foreground">
                  When did the symptom first appear?
                </p>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="symptom_notes">Additional Notes</Label>
                <Textarea
                  id="symptom_notes"
                  placeholder="Enter any additional observations or details about this symptom..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={disabled}
                  rows={3}
                />
              </div>

              <Button
                type="button"
                onClick={handleAddSymptom}
                disabled={!severity || disabled}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Symptom to Visit
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Recorded Symptoms List */}
      {symptoms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recorded Symptoms ({symptoms.length})</CardTitle>
            <CardDescription>Symptoms documented during this visit</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {symptoms.map((recordedSymptom, index) => (
              <Card key={index} className="border-2">
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    {/* Symptom Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">
                            {recordedSymptom.symptom.symptom_name}
                          </h4>
                          <Badge variant="secondary">
                            {recordedSymptom.symptom.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {recordedSymptom.symptom.body_system}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveSymptom(index)}
                        disabled={disabled}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>

                    <Separator />

                    {/* Symptom Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Severity:</span>
                        <Badge variant="outline" className="ml-2">
                          {recordedSymptom.severity}
                        </Badge>
                      </div>
                      {recordedSymptom.onset_date && (
                        <div>
                          <span className="font-medium">Onset Date:</span>
                          <span className="ml-2 text-muted-foreground">
                            {new Date(recordedSymptom.onset_date).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {recordedSymptom.notes && (
                      <>
                        <Separator />
                        <div>
                          <p className="text-sm font-medium mb-1">Notes:</p>
                          <p className="text-sm text-muted-foreground">
                            {recordedSymptom.notes}
                          </p>
                        </div>
                      </>
                    )}

                    <Separator />

                    {/* Recording Metadata */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>
                            {new Date(recordedSymptom.recorded_at).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <UserIcon className="h-3 w-3" />
                          <span>{recordedSymptom.recorded_by}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {symptoms.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              No symptoms recorded yet
            </p>
            <p className="text-xs text-muted-foreground">
              Use the form above to add symptoms to this visit
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
