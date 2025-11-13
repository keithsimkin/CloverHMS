/**
 * Clinical Page
 * Main page for clinical workflows with patient search and visit interface
 * Requirements: 14.1, 14.2, 14.3, 14.4, 14.5
 */

import { useState, useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Search, Plus, FileText, Clock, User as UserIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { PatientVisitForm } from '@/components/clinical/PatientVisitForm';
import { generateMockPatients } from '@/lib/mockData';
import type { Patient } from '@/types/models';

export default function Clinical() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isVisitDialogOpen, setIsVisitDialogOpen] = useState(false);
  const { toast } = useToast();

  // Mock data - will be replaced with real API call
  const patients = useMemo(() => generateMockPatients(50), []);

  // Mock patient clinical history
  const patientClinicalHistory = useMemo(() => {
    if (!selectedPatient) return null;

    return {
      recentVisits: [
        {
          visit_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          visit_type: 'Consultation',
          provider: 'Dr. Sarah Johnson',
          chief_complaint: 'Fever and cough',
          diagnoses: ['Upper Respiratory Tract Infection'],
        },
        {
          visit_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          visit_type: 'Follow-up',
          provider: 'Dr. Michael Chen',
          chief_complaint: 'Follow-up for hypertension',
          diagnoses: ['Essential Hypertension'],
        },
      ],
      chronicConditions: [
        { diagnosis: 'Essential Hypertension', since: new Date(2020, 0, 1) },
        { diagnosis: 'Type 2 Diabetes Mellitus', since: new Date(2019, 5, 15) },
      ],
      activeMedications: [
        { medicine: 'Lisinopril', dosage: '10mg', frequency: 'Once daily' },
        { medicine: 'Metformin', dosage: '500mg', frequency: 'Twice daily' },
      ],
    };
  }, [selectedPatient]);

  const filteredPatients = useMemo(() => {
    if (!searchQuery) return patients;

    const query = searchQuery.toLowerCase();
    return patients.filter(
      (patient) =>
        patient.first_name.toLowerCase().includes(query) ||
        patient.last_name.toLowerCase().includes(query) ||
        patient.patient_id.toLowerCase().includes(query) ||
        patient.contact_phone.includes(query)
    );
  }, [patients, searchQuery]);

  const handleStartVisit = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsVisitDialogOpen(true);
  };

  const handleVisitSubmit = (data: any) => {
    console.log('Visit data:', data);
    toast({
      title: 'Visit Completed',
      description: `Visit for ${selectedPatient?.first_name} ${selectedPatient?.last_name} has been recorded successfully.`,
    });
    setIsVisitDialogOpen(false);
    setSelectedPatient(null);
  };

  const handleCancelVisit = () => {
    setIsVisitDialogOpen(false);
    setSelectedPatient(null);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Clinical Workflow</h1>
        <p className="text-muted-foreground">
          Document patient visits with integrated symptom, diagnosis, and prescription management
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Search & List */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Patient Search</CardTitle>
              <CardDescription>Search and select a patient to start a visit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, ID, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Patient List */}
              <ScrollArea className="h-[600px]">
                <div className="space-y-2">
                  {filteredPatients.length > 0 ? (
                    filteredPatients.map((patient) => (
                      <Card
                        key={patient.id}
                        className={`cursor-pointer transition-colors hover:bg-secondary ${
                          selectedPatient?.id === patient.id ? 'border-primary' : ''
                        }`}
                        onClick={() => setSelectedPatient(patient)}
                      >
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold">
                                  {patient.first_name} {patient.last_name}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  ID: {patient.patient_id}
                                </p>
                              </div>
                              <Badge variant="outline">{patient.gender}</Badge>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              <p>DOB: {new Date(patient.date_of_birth).toLocaleDateString()}</p>
                              <p>Phone: {patient.contact_phone}</p>
                            </div>
                            {patient.allergies && patient.allergies.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {patient.allergies.map((allergy) => (
                                  <Badge key={allergy} variant="destructive" className="text-xs">
                                    {allergy}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No patients found</p>
                      <p className="text-sm">Try adjusting your search</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Patient Details & Clinical History */}
        <div className="lg:col-span-2 space-y-4">
          {selectedPatient ? (
            <>
              {/* Patient Overview */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>
                        {selectedPatient.first_name} {selectedPatient.last_name}
                      </CardTitle>
                      <CardDescription>
                        Patient ID: {selectedPatient.patient_id}
                      </CardDescription>
                    </div>
                    <Button onClick={() => handleStartVisit(selectedPatient)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Start Visit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Date of Birth:</span>
                      <span className="ml-2 text-muted-foreground">
                        {new Date(selectedPatient.date_of_birth).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Gender:</span>
                      <span className="ml-2 text-muted-foreground">
                        {selectedPatient.gender}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Phone:</span>
                      <span className="ml-2 text-muted-foreground">
                        {selectedPatient.contact_phone}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Email:</span>
                      <span className="ml-2 text-muted-foreground">
                        {selectedPatient.contact_email || 'N/A'}
                      </span>
                    </div>
                    {selectedPatient.blood_type && (
                      <div>
                        <span className="font-medium">Blood Type:</span>
                        <span className="ml-2 text-muted-foreground">
                          {selectedPatient.blood_type}
                        </span>
                      </div>
                    )}
                  </div>

                  {selectedPatient.allergies && selectedPatient.allergies.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Allergies</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedPatient.allergies.map((allergy) => (
                            <Badge key={allergy} variant="destructive">
                              {allergy}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {selectedPatient.medical_history && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Medical History</h4>
                        <p className="text-sm text-muted-foreground">
                          {selectedPatient.medical_history}
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Clinical History */}
              {patientClinicalHistory && (
                <>
                  {/* Recent Visits */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Visits</CardTitle>
                      <CardDescription>Patient's recent clinical encounters</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {patientClinicalHistory.recentVisits.map((visit, index) => (
                          <Card key={index}>
                            <CardContent className="pt-4">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm font-medium">
                                      {visit.visit_date.toLocaleDateString()}
                                    </span>
                                  </div>
                                  <Badge variant="secondary">{visit.visit_type}</Badge>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-muted-foreground">{visit.provider}</span>
                                </div>
                                <div className="text-sm">
                                  <span className="font-medium">Chief Complaint:</span>
                                  <span className="ml-2 text-muted-foreground">
                                    {visit.chief_complaint}
                                  </span>
                                </div>
                                <div className="text-sm">
                                  <span className="font-medium">Diagnoses:</span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {visit.diagnoses.map((diagnosis) => (
                                      <Badge key={diagnosis} variant="outline">
                                        {diagnosis}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Chronic Conditions */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Chronic Conditions</CardTitle>
                      <CardDescription>Long-term health conditions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {patientClinicalHistory.chronicConditions.map((condition, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 border rounded"
                          >
                            <span className="text-sm font-medium">{condition.diagnosis}</span>
                            <span className="text-xs text-muted-foreground">
                              Since {condition.since.getFullYear()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Active Medications */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Active Medications</CardTitle>
                      <CardDescription>Current prescriptions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {patientClinicalHistory.activeMedications.map((medication, index) => (
                          <div key={index} className="p-2 border rounded space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{medication.medicine}</span>
                              <Badge variant="default">Active</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {medication.dosage} - {medication.frequency}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </>
          ) : (
            <Card className="h-[600px] flex items-center justify-center">
              <CardContent className="text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Patient Selected</h3>
                <p className="text-sm text-muted-foreground">
                  Search and select a patient from the list to view their clinical history
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Visit Dialog */}
      <Dialog open={isVisitDialogOpen} onOpenChange={setIsVisitDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Patient Visit</DialogTitle>
            <DialogDescription>
              Document the patient visit with symptoms, diagnosis, and prescriptions
            </DialogDescription>
          </DialogHeader>
          {selectedPatient && (
            <PatientVisitForm
              patientId={selectedPatient.id}
              onSubmit={handleVisitSubmit}
              onCancel={handleCancelVisit}
            />
          )}
        </DialogContent>
      </Dialog>
      </div>
    </MainLayout>
  );
}
