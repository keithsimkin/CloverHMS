import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { PatientList } from '@/components/patients/PatientList';
import { PatientSearch } from '@/components/patients/PatientSearch';
import { PatientForm } from '@/components/patients/PatientForm';
import { PatientDetails } from '@/components/patients/PatientDetails';
import { PlusIcon } from '@heroicons/react/24/outline';
import { generateMockPatients, generateMockPatientVisits } from '@/lib/mockData';
import type { Patient } from '@/types/models';
import { Gender } from '@/types/enums';

export default function Patients() {
  const { toast } = useToast();
  const [patients, setPatients] = useState<Patient[]>(() => generateMockPatients(50));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter patients based on search query
  const filteredPatients = useMemo(() => {
    if (!searchQuery.trim()) return patients;

    const query = searchQuery.toLowerCase();
    return patients.filter(
      (patient) =>
        patient.first_name.toLowerCase().includes(query) ||
        patient.last_name.toLowerCase().includes(query) ||
        patient.patient_id.toLowerCase().includes(query) ||
        patient.contact_phone.includes(query) ||
        (patient.contact_email && patient.contact_email.toLowerCase().includes(query))
    );
  }, [patients, searchQuery]);

  const handleCreatePatient = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newPatient: Patient = {
        id: `patient-${Date.now()}`,
        patient_id: `P${Math.floor(10000 + Math.random() * 90000)}`,
        first_name: data.first_name,
        last_name: data.last_name,
        date_of_birth: new Date(data.date_of_birth),
        gender: data.gender as Gender,
        contact_phone: data.contact_phone,
        contact_email: data.contact_email || undefined,
        address: data.address,
        emergency_contact_name: data.emergency_contact_name,
        emergency_contact_phone: data.emergency_contact_phone,
        blood_type: data.blood_type || undefined,
        allergies: data.allergies ? data.allergies.split(',').map((a: string) => a.trim()) : undefined,
        medical_history: data.medical_history || undefined,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: 'current-user-id',
      };

      setPatients((prev) => [newPatient, ...prev]);
      setIsCreateDialogOpen(false);

      toast({
        title: 'Patient created',
        description: `${newPatient.first_name} ${newPatient.last_name} has been added successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create patient. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePatient = async (data: any) => {
    if (!selectedPatient) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const updatedPatient: Patient = {
        ...selectedPatient,
        first_name: data.first_name,
        last_name: data.last_name,
        date_of_birth: new Date(data.date_of_birth),
        gender: data.gender as Gender,
        contact_phone: data.contact_phone,
        contact_email: data.contact_email || undefined,
        address: data.address,
        emergency_contact_name: data.emergency_contact_name,
        emergency_contact_phone: data.emergency_contact_phone,
        blood_type: data.blood_type || undefined,
        allergies: data.allergies ? data.allergies.split(',').map((a: string) => a.trim()) : undefined,
        medical_history: data.medical_history || undefined,
        updated_at: new Date(),
      };

      setPatients((prev) =>
        prev.map((p) => (p.id === selectedPatient.id ? updatedPatient : p))
      );
      setIsEditDialogOpen(false);
      setSelectedPatient(null);

      toast({
        title: 'Patient updated',
        description: `${updatedPatient.first_name} ${updatedPatient.last_name} has been updated successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update patient. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePatient = async (patient: Patient) => {
    if (!confirm(`Are you sure you want to delete ${patient.first_name} ${patient.last_name}?`)) {
      return;
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setPatients((prev) => prev.filter((p) => p.id !== patient.id));

      toast({
        title: 'Patient deleted',
        description: `${patient.first_name} ${patient.last_name} has been removed.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete patient. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsDetailsDialogOpen(true);
  };

  const handleEditClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Patients</h1>
          <p className="text-muted-foreground mt-1">
            Manage patient records and information
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Patient
        </Button>
      </div>

      {/* Search */}
      <PatientSearch onSearch={setSearchQuery} />

      {/* Patient List */}
      <PatientList
        patients={filteredPatients}
        onPatientSelect={handlePatientSelect}
        onEdit={handleEditClick}
        onDelete={handleDeletePatient}
      />

      {/* Create Patient Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Patient</DialogTitle>
            <DialogDescription>
              Enter the patient's information below. Fields marked with * are required.
            </DialogDescription>
          </DialogHeader>
          <PatientForm
            onSubmit={handleCreatePatient}
            onCancel={() => setIsCreateDialogOpen(false)}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Patient Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Patient</DialogTitle>
            <DialogDescription>
              Update the patient's information below. Fields marked with * are required.
            </DialogDescription>
          </DialogHeader>
          {selectedPatient && (
            <PatientForm
              patient={selectedPatient}
              onSubmit={handleUpdatePatient}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setSelectedPatient(null);
              }}
              isSubmitting={isSubmitting}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Patient Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedPatient && (
            <PatientDetails
              patient={selectedPatient}
              visits={generateMockPatientVisits(selectedPatient.id, 5)}
              onEdit={() => {
                setIsDetailsDialogOpen(false);
                setIsEditDialogOpen(true);
              }}
              onDelete={() => {
                setIsDetailsDialogOpen(false);
                handleDeletePatient(selectedPatient);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
