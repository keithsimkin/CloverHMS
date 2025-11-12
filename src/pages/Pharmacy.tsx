/**
 * Pharmacy Page
 * Displays pending prescriptions and handles medication dispensing
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { DispenseForm } from '@/components/pharmacy/DispenseForm';
import { useToast } from '@/hooks/use-toast';
import type { Prescription, Medicine, PharmacyDispense } from '@/types/models';
import { PrescriptionStatus } from '@/types/enums';
import {
  generateMockPatient,
  generateMockMedicine,
  generateMockPrescription,
  generateMockPharmacyDispense,
} from '@/lib/mockData';
import { PillIcon, SearchIcon, CheckCircle2Icon, ClockIcon, XCircleIcon } from 'lucide-react';

// Generate mock data
const mockPatients = Array.from({ length: 20 }, () => generateMockPatient());
const mockMedicines = Array.from({ length: 10 }, () => generateMockMedicine());

// Generate prescriptions with patient and medicine details
const mockPrescriptionsData = mockPatients.slice(0, 15).map((patient) => {
  const medicine = mockMedicines[Math.floor(Math.random() * mockMedicines.length)];
  const prescription = generateMockPrescription(patient.id, 'visit-' + patient.id, medicine.id);
  return {
    ...prescription,
    patient_name: `${patient.first_name} ${patient.last_name}`,
    patient_id_display: patient.patient_id,
    medicine,
  };
});

// Generate dispensing history
const mockDispensingHistory = mockPrescriptionsData.slice(0, 8).map((prescription) =>
  generateMockPharmacyDispense(prescription.id, prescription.patient_id, 'flow-' + prescription.patient_id, {
    medicine_id: prescription.medicine_id,
  })
);

type PrescriptionWithDetails = Prescription & {
  patient_name: string;
  patient_id_display: string;
  medicine: Medicine;
};

export default function Pharmacy() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState<PrescriptionWithDetails | null>(null);
  const [dispenseDialogOpen, setDispenseDialogOpen] = useState(false);
  const [prescriptions, setPrescriptions] = useState<PrescriptionWithDetails[]>(mockPrescriptionsData);
  const [dispensingHistory, setDispensingHistory] = useState<PharmacyDispense[]>(mockDispensingHistory);

  // Filter prescriptions based on search query
  const filteredPrescriptions = prescriptions.filter((prescription) => {
    const query = searchQuery.toLowerCase();
    return (
      prescription.patient_name.toLowerCase().includes(query) ||
      prescription.patient_id_display.toLowerCase().includes(query) ||
      prescription.medicine.medicine_name.toLowerCase().includes(query)
    );
  });

  // Separate prescriptions by status
  const pendingPrescriptions = filteredPrescriptions.filter(
    (p) => p.status === PrescriptionStatus.ACTIVE
  );
  const completedPrescriptions = filteredPrescriptions.filter(
    (p) => p.status === PrescriptionStatus.COMPLETED
  );
  const discontinuedPrescriptions = filteredPrescriptions.filter(
    (p) => p.status === PrescriptionStatus.DISCONTINUED
  );

  const handleDispenseClick = (prescription: PrescriptionWithDetails) => {
    setSelectedPrescription(prescription);
    setDispenseDialogOpen(true);
  };

  const handleDispenseSubmit = (dispenseData: Partial<PharmacyDispense>) => {
    if (!selectedPrescription) return;

    // Create new dispense record
    const newDispense: PharmacyDispense = {
      id: `dispense-${Date.now()}`,
      prescription_id: selectedPrescription.id,
      patient_id: selectedPrescription.patient_id,
      flow_id: `flow-${selectedPrescription.patient_id}`,
      medicine_id: selectedPrescription.medicine_id,
      quantity_dispensed: dispenseData.quantity_dispensed || 0,
      dispensed_by: 'current-user-id',
      dispensed_at: new Date(),
      patient_counseling_provided: dispenseData.patient_counseling_provided || false,
      notes: dispenseData.notes,
    };

    // Update prescription status to completed
    setPrescriptions((prev) =>
      prev.map((p) =>
        p.id === selectedPrescription.id ? { ...p, status: PrescriptionStatus.COMPLETED } : p
      )
    );

    // Add to dispensing history
    setDispensingHistory((prev) => [newDispense, ...prev]);

    toast({
      title: 'Medication Dispensed',
      description: `${selectedPrescription.medicine.medicine_name} dispensed successfully to ${selectedPrescription.patient_name}`,
    });

    setDispenseDialogOpen(false);
    setSelectedPrescription(null);
  };

  const getStatusBadge = (status: PrescriptionStatus) => {
    switch (status) {
      case PrescriptionStatus.ACTIVE:
        return (
          <Badge variant="default" className="bg-blue-600">
            <ClockIcon className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case PrescriptionStatus.COMPLETED:
        return (
          <Badge variant="default" className="bg-green-600">
            <CheckCircle2Icon className="w-3 h-3 mr-1" />
            Dispensed
          </Badge>
        );
      case PrescriptionStatus.DISCONTINUED:
        return (
          <Badge variant="destructive">
            <XCircleIcon className="w-3 h-3 mr-1" />
            Discontinued
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const renderPrescriptionTable = (prescriptionList: PrescriptionWithDetails[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Patient ID</TableHead>
          <TableHead>Patient Name</TableHead>
          <TableHead>Medicine</TableHead>
          <TableHead>Dosage</TableHead>
          <TableHead>Frequency</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {prescriptionList.length === 0 ? (
          <TableRow>
            <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
              No prescriptions found
            </TableCell>
          </TableRow>
        ) : (
          prescriptionList.map((prescription) => (
            <TableRow key={prescription.id}>
              <TableCell className="font-medium">{prescription.patient_id_display}</TableCell>
              <TableCell>{prescription.patient_name}</TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{prescription.medicine.medicine_name}</div>
                  <div className="text-sm text-muted-foreground">
                    {prescription.medicine.generic_name}
                  </div>
                </div>
              </TableCell>
              <TableCell>{prescription.dosage}</TableCell>
              <TableCell>{prescription.frequency}</TableCell>
              <TableCell>{prescription.duration}</TableCell>
              <TableCell>{prescription.quantity}</TableCell>
              <TableCell>{getStatusBadge(prescription.status)}</TableCell>
              <TableCell>
                {prescription.status === PrescriptionStatus.ACTIVE && (
                  <Button size="sm" onClick={() => handleDispenseClick(prescription)}>
                    <PillIcon className="w-4 h-4 mr-1" />
                    Dispense
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Pharmacy</h1>
        <p className="text-muted-foreground">Manage medication dispensing and prescription fulfillment</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Prescriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPrescriptions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Dispensed Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dispensingHistory.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedPrescriptions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Discontinued
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{discontinuedPrescriptions.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Prescriptions</CardTitle>
          <CardDescription>Search by patient name, ID, or medicine name</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search prescriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Prescriptions Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Prescriptions</CardTitle>
          <CardDescription>View and manage prescription dispensing</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pending">
                Pending ({pendingPrescriptions.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Dispensed ({completedPrescriptions.length})
              </TabsTrigger>
              <TabsTrigger value="discontinued">
                Discontinued ({discontinuedPrescriptions.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="pending" className="mt-4">
              {renderPrescriptionTable(pendingPrescriptions)}
            </TabsContent>
            <TabsContent value="completed" className="mt-4">
              {renderPrescriptionTable(completedPrescriptions)}
            </TabsContent>
            <TabsContent value="discontinued" className="mt-4">
              {renderPrescriptionTable(discontinuedPrescriptions)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Dispense Dialog */}
      <Dialog open={dispenseDialogOpen} onOpenChange={setDispenseDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Dispense Medication</DialogTitle>
            <DialogDescription>
              Complete the form below to dispense medication to the patient
            </DialogDescription>
          </DialogHeader>
          {selectedPrescription && (
            <DispenseForm
              prescription={selectedPrescription}
              onSubmit={handleDispenseSubmit}
              onCancel={() => {
                setDispenseDialogOpen(false);
                setSelectedPrescription(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
