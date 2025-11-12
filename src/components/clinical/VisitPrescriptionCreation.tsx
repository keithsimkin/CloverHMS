/**
 * VisitPrescriptionCreation Component
 * Creates prescriptions during a patient visit with drug interaction checking
 * Requirements: 12.3, 12.6
 */

import { useState, useMemo } from 'react';
import { Plus, Trash2, Clock, User as UserIcon, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MedicineSearch } from './MedicineSearch';
import { DrugInteractionWarning, checkDrugInteractions } from './DrugInteractionWarning';
import { PrescriptionStatus } from '@/types/enums';
import type { Medicine } from '@/types/models';

export interface RecordedPrescription {
  medicine: Medicine;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  special_instructions?: string;
  prescribed_at: Date;
  prescribed_by: string;
  status: PrescriptionStatus;
}

interface VisitPrescriptionCreationProps {
  prescriptions: RecordedPrescription[];
  onPrescriptionsChange: (prescriptions: RecordedPrescription[]) => void;
  patientHistory?: Array<{
    medicine_name: string;
    dosage: string;
    frequency: string;
    status: string;
  }>;
  patientAllergies?: string[];
  currentUser?: string;
  disabled?: boolean;
}

export function VisitPrescriptionCreation({
  prescriptions,
  onPrescriptionsChange,
  patientHistory = [],
  patientAllergies = [],
  currentUser = 'Current User',
  disabled = false,
}: VisitPrescriptionCreationProps) {
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [dosage, setDosage] = useState<string>('');
  const [frequency, setFrequency] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');

  // Check for drug interactions
  const drugInteractions = useMemo(() => {
    const medicines = prescriptions.map((p) => p.medicine);
    if (selectedMedicine) {
      medicines.push(selectedMedicine);
    }
    return checkDrugInteractions(medicines);
  }, [prescriptions, selectedMedicine]);

  const handleAddPrescription = () => {
    if (!selectedMedicine || !dosage || !frequency || !duration || !quantity) {
      return;
    }

    const newPrescription: RecordedPrescription = {
      medicine: selectedMedicine,
      dosage,
      frequency,
      duration,
      quantity: parseInt(quantity),
      special_instructions: specialInstructions || undefined,
      prescribed_at: new Date(),
      prescribed_by: currentUser,
      status: PrescriptionStatus.ACTIVE,
    };

    onPrescriptionsChange([...prescriptions, newPrescription]);

    // Reset form
    setSelectedMedicine(null);
    setDosage('');
    setFrequency('');
    setDuration('');
    setQuantity('');
    setSpecialInstructions('');
  };

  const handleRemovePrescription = (index: number) => {
    const updatedPrescriptions = prescriptions.filter((_, i) => i !== index);
    onPrescriptionsChange(updatedPrescriptions);
  };

  const canAddPrescription = selectedMedicine && dosage && frequency && duration && quantity;

  return (
    <div className="space-y-6">
      {/* Patient Allergies Warning */}
      {patientAllergies.length > 0 && (
        <Card className="border-destructive">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <CardTitle className="text-destructive">Patient Allergies</CardTitle>
            </div>
            <CardDescription>
              Check for allergies before prescribing medications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {patientAllergies.map((allergy) => (
                <Badge key={allergy} variant="destructive">
                  {allergy}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Prescription History */}
      {patientHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Prescription History</CardTitle>
            <CardDescription>Patient's previous prescriptions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {patientHistory.map((prescription, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <span className="text-sm font-medium">{prescription.medicine_name}</span>
                  <p className="text-xs text-muted-foreground">
                    {prescription.dosage} - {prescription.frequency}
                  </p>
                </div>
                <Badge variant={prescription.status === 'active' ? 'default' : 'secondary'}>
                  {prescription.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Drug Interaction Warnings */}
      {drugInteractions.length > 0 && (
        <DrugInteractionWarning interactions={drugInteractions} />
      )}

      {/* Add New Prescription */}
      <Card>
        <CardHeader>
          <CardTitle>Add Prescription</CardTitle>
          <CardDescription>Search and prescribe medication</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Medicine Search */}
          <div className="space-y-2">
            <Label>Medicine *</Label>
            <MedicineSearch
              value={selectedMedicine?.id}
              onSelect={setSelectedMedicine}
              disabled={disabled}
            />
          </div>

          {selectedMedicine && (
            <>
              <Separator />

              {/* Dosage */}
              <div className="space-y-2">
                <Label htmlFor="dosage">Dosage *</Label>
                <Input
                  id="dosage"
                  placeholder="e.g., 500mg, 10ml, 1 tablet"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  disabled={disabled}
                />
                <p className="text-xs text-muted-foreground">
                  Available strengths: {selectedMedicine.strength_options.join(', ')}
                </p>
              </div>

              {/* Frequency */}
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency *</Label>
                <Input
                  id="frequency"
                  placeholder="e.g., Three times daily, Every 8 hours, Once daily"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  disabled={disabled}
                />
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label htmlFor="duration">Duration *</Label>
                <Input
                  id="duration"
                  placeholder="e.g., 7 days, 2 weeks, 1 month"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  disabled={disabled}
                />
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="Total quantity to dispense"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  disabled={disabled}
                  min="1"
                />
              </div>

              {/* Special Instructions */}
              <div className="space-y-2">
                <Label htmlFor="special_instructions">Special Instructions</Label>
                <Textarea
                  id="special_instructions"
                  placeholder="e.g., Take with food, Avoid alcohol, Take before bedtime..."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  disabled={disabled}
                  rows={3}
                />
              </div>

              <Button
                type="button"
                onClick={handleAddPrescription}
                disabled={!canAddPrescription || disabled}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Prescription to Visit
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Recorded Prescriptions List */}
      {prescriptions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recorded Prescriptions ({prescriptions.length})</CardTitle>
            <CardDescription>Medications prescribed during this visit</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {prescriptions.map((prescription, index) => (
              <Card key={index} className="border-2">
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    {/* Prescription Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">
                            {prescription.medicine.medicine_name}
                          </h4>
                          <Badge variant="secondary">
                            {prescription.medicine.therapeutic_category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Generic: {prescription.medicine.generic_name}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemovePrescription(index)}
                        disabled={disabled}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>

                    <Separator />

                    {/* Prescription Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Dosage:</span>
                        <span className="ml-2 text-muted-foreground">
                          {prescription.dosage}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Frequency:</span>
                        <span className="ml-2 text-muted-foreground">
                          {prescription.frequency}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Duration:</span>
                        <span className="ml-2 text-muted-foreground">
                          {prescription.duration}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Quantity:</span>
                        <span className="ml-2 text-muted-foreground">
                          {prescription.quantity}
                        </span>
                      </div>
                    </div>

                    {/* Special Instructions */}
                    {prescription.special_instructions && (
                      <>
                        <Separator />
                        <div>
                          <p className="text-sm font-medium mb-1">Special Instructions:</p>
                          <p className="text-sm text-muted-foreground">
                            {prescription.special_instructions}
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
                            {new Date(prescription.prescribed_at).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <UserIcon className="h-3 w-3" />
                          <span>{prescription.prescribed_by}</span>
                        </div>
                      </div>
                      <Badge variant="default">{prescription.status}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {prescriptions.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              No prescriptions recorded yet
            </p>
            <p className="text-xs text-muted-foreground">
              Use the form above to add prescriptions to this visit
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
