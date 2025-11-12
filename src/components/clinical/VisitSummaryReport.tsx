/**
 * VisitSummaryReport Component
 * Displays comprehensive visit summary with all recorded data and report generation
 * Requirements: 14.3, 14.4, 14.5
 */

import { FileText, Download, Printer, Calendar, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { RecordedSymptom } from './VisitSymptomRecording';
import type { RecordedDiagnosis } from './VisitDiagnosisRecording';
import type { RecordedPrescription } from './VisitPrescriptionCreation';
import type { Patient, Staff } from '@/types/models';

interface VisitSummaryReportProps {
  patient: Patient;
  provider: Staff;
  visitType: string;
  chiefComplaint: string;
  vitalSigns: {
    temperature?: number;
    blood_pressure?: string;
    heart_rate?: number;
    respiratory_rate?: number;
    oxygen_saturation?: number;
  };
  symptoms: RecordedSymptom[];
  diagnoses: RecordedDiagnosis[];
  prescriptions: RecordedPrescription[];
  visitSummary?: string;
  followUpRecommendations?: string;
  visitDate?: Date;
}

export function VisitSummaryReport({
  patient,
  provider,
  visitType,
  chiefComplaint,
  vitalSigns,
  symptoms,
  diagnoses,
  prescriptions,
  visitSummary,
  followUpRecommendations,
  visitDate = new Date(),
}: VisitSummaryReportProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    // Mock implementation - would integrate with PDF generation library
    alert('PDF export functionality will be implemented with a PDF library');
  };

  const handleExportText = () => {
    const reportText = generateTextReport();
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `visit-report-${patient.patient_id}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateTextReport = () => {
    let report = '='.repeat(80) + '\n';
    report += 'PATIENT VISIT REPORT\n';
    report += '='.repeat(80) + '\n\n';

    // Patient Information
    report += 'PATIENT INFORMATION\n';
    report += '-'.repeat(80) + '\n';
    report += `Name: ${patient.first_name} ${patient.last_name}\n`;
    report += `Patient ID: ${patient.patient_id}\n`;
    report += `Date of Birth: ${new Date(patient.date_of_birth).toLocaleDateString()}\n`;
    report += `Gender: ${patient.gender}\n`;
    report += `Contact: ${patient.contact_phone}\n`;
    if (patient.allergies && patient.allergies.length > 0) {
      report += `Allergies: ${patient.allergies.join(', ')}\n`;
    }
    report += '\n';

    // Visit Information
    report += 'VISIT INFORMATION\n';
    report += '-'.repeat(80) + '\n';
    report += `Date: ${visitDate.toLocaleString()}\n`;
    report += `Provider: Dr. ${provider.first_name} ${provider.last_name}\n`;
    report += `Specialization: ${provider.specialization}\n`;
    report += `Visit Type: ${visitType}\n`;
    report += `Chief Complaint: ${chiefComplaint}\n`;
    report += '\n';

    // Vital Signs
    report += 'VITAL SIGNS\n';
    report += '-'.repeat(80) + '\n';
    if (vitalSigns.temperature) report += `Temperature: ${vitalSigns.temperature}°C\n`;
    if (vitalSigns.blood_pressure) report += `Blood Pressure: ${vitalSigns.blood_pressure} mmHg\n`;
    if (vitalSigns.heart_rate) report += `Heart Rate: ${vitalSigns.heart_rate} bpm\n`;
    if (vitalSigns.respiratory_rate) report += `Respiratory Rate: ${vitalSigns.respiratory_rate} breaths/min\n`;
    if (vitalSigns.oxygen_saturation) report += `Oxygen Saturation: ${vitalSigns.oxygen_saturation}%\n`;
    report += '\n';

    // Symptoms
    if (symptoms.length > 0) {
      report += 'SYMPTOMS\n';
      report += '-'.repeat(80) + '\n';
      symptoms.forEach((symptom, index) => {
        report += `${index + 1}. ${symptom.symptom.symptom_name}\n`;
        report += `   Severity: ${symptom.severity}\n`;
        report += `   Category: ${symptom.symptom.category}\n`;
        if (symptom.onset_date) {
          report += `   Onset: ${new Date(symptom.onset_date).toLocaleDateString()}\n`;
        }
        if (symptom.notes) {
          report += `   Notes: ${symptom.notes}\n`;
        }
        report += '\n';
      });
    }

    // Diagnoses
    if (diagnoses.length > 0) {
      report += 'DIAGNOSES\n';
      report += '-'.repeat(80) + '\n';
      diagnoses.forEach((diagnosis, index) => {
        report += `${index + 1}. ${diagnosis.diagnosis.diagnosis_name}\n`;
        report += `   ICD-10 Code: ${diagnosis.diagnosis.diagnosis_code}\n`;
        report += `   Severity: ${diagnosis.severity}\n`;
        report += `   Status: ${diagnosis.status}\n`;
        if (diagnosis.clinical_notes) {
          report += `   Clinical Notes: ${diagnosis.clinical_notes}\n`;
        }
        report += '\n';
      });
    }

    // Prescriptions
    if (prescriptions.length > 0) {
      report += 'PRESCRIPTIONS\n';
      report += '-'.repeat(80) + '\n';
      prescriptions.forEach((prescription, index) => {
        report += `${index + 1}. ${prescription.medicine.medicine_name}\n`;
        report += `   Generic: ${prescription.medicine.generic_name}\n`;
        report += `   Dosage: ${prescription.dosage}\n`;
        report += `   Frequency: ${prescription.frequency}\n`;
        report += `   Duration: ${prescription.duration}\n`;
        report += `   Quantity: ${prescription.quantity}\n`;
        if (prescription.special_instructions) {
          report += `   Instructions: ${prescription.special_instructions}\n`;
        }
        report += '\n';
      });
    }

    // Visit Summary
    if (visitSummary) {
      report += 'VISIT SUMMARY\n';
      report += '-'.repeat(80) + '\n';
      report += visitSummary + '\n\n';
    }

    // Follow-up
    if (followUpRecommendations) {
      report += 'FOLLOW-UP RECOMMENDATIONS\n';
      report += '-'.repeat(80) + '\n';
      report += followUpRecommendations + '\n\n';
    }

    report += '='.repeat(80) + '\n';
    report += 'End of Report\n';
    report += '='.repeat(80) + '\n';

    return report;
  };

  return (
    <div className="space-y-6">
      {/* Export Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Visit Report</CardTitle>
          <CardDescription>Export or print the complete visit report</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button onClick={handlePrint} variant="outline">
              <Printer className="mr-2 h-4 w-4" />
              Print Report
            </Button>
            <Button onClick={handleExportPDF} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export as PDF
            </Button>
            <Button onClick={handleExportText} variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Export as Text
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Visit Summary Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Visit Summary</CardTitle>
          <CardDescription>Complete overview of the patient visit</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-6">
              {/* Patient & Visit Info */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {patient.first_name} {patient.last_name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Patient ID: {patient.patient_id}
                    </p>
                  </div>
                  <Badge variant="secondary">{visitType}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{visitDate.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Dr. {provider.first_name} {provider.last_name}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Chief Complaint */}
              <div>
                <h4 className="text-sm font-semibold mb-2">Chief Complaint</h4>
                <p className="text-sm text-muted-foreground">{chiefComplaint}</p>
              </div>

              <Separator />

              {/* Vital Signs */}
              <div>
                <h4 className="text-sm font-semibold mb-3">Vital Signs</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {vitalSigns.temperature && (
                    <div className="flex justify-between p-2 border rounded">
                      <span className="font-medium">Temperature:</span>
                      <span>{vitalSigns.temperature}°C</span>
                    </div>
                  )}
                  {vitalSigns.blood_pressure && (
                    <div className="flex justify-between p-2 border rounded">
                      <span className="font-medium">Blood Pressure:</span>
                      <span>{vitalSigns.blood_pressure} mmHg</span>
                    </div>
                  )}
                  {vitalSigns.heart_rate && (
                    <div className="flex justify-between p-2 border rounded">
                      <span className="font-medium">Heart Rate:</span>
                      <span>{vitalSigns.heart_rate} bpm</span>
                    </div>
                  )}
                  {vitalSigns.respiratory_rate && (
                    <div className="flex justify-between p-2 border rounded">
                      <span className="font-medium">Respiratory Rate:</span>
                      <span>{vitalSigns.respiratory_rate} breaths/min</span>
                    </div>
                  )}
                  {vitalSigns.oxygen_saturation && (
                    <div className="flex justify-between p-2 border rounded">
                      <span className="font-medium">O₂ Saturation:</span>
                      <span>{vitalSigns.oxygen_saturation}%</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Symptoms */}
              {symptoms.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-semibold mb-3">
                      Symptoms ({symptoms.length})
                    </h4>
                    <div className="space-y-2">
                      {symptoms.map((symptom, index) => (
                        <div key={index} className="p-3 border rounded space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{symptom.symptom.symptom_name}</span>
                            <Badge variant="outline">{symptom.severity}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {symptom.symptom.category} - {symptom.symptom.body_system}
                          </p>
                          {symptom.notes && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {symptom.notes}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Diagnoses */}
              {diagnoses.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-semibold mb-3">
                      Diagnoses ({diagnoses.length})
                    </h4>
                    <div className="space-y-2">
                      {diagnoses.map((diagnosis, index) => (
                        <div key={index} className="p-3 border rounded space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="font-mono">
                              {diagnosis.diagnosis.diagnosis_code}
                            </Badge>
                            <span className="font-medium">
                              {diagnosis.diagnosis.diagnosis_name}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="outline">{diagnosis.severity}</Badge>
                            <Badge variant="outline">{diagnosis.status}</Badge>
                          </div>
                          {diagnosis.clinical_notes && (
                            <p className="text-xs text-muted-foreground">
                              {diagnosis.clinical_notes}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Prescriptions */}
              {prescriptions.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-semibold mb-3">
                      Prescriptions ({prescriptions.length})
                    </h4>
                    <div className="space-y-2">
                      {prescriptions.map((prescription, index) => (
                        <div key={index} className="p-3 border rounded space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">
                              {prescription.medicine.medicine_name}
                            </span>
                            <Badge variant="secondary">
                              {prescription.medicine.therapeutic_category}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-muted-foreground">Dosage:</span>{' '}
                              {prescription.dosage}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Frequency:</span>{' '}
                              {prescription.frequency}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Duration:</span>{' '}
                              {prescription.duration}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Quantity:</span>{' '}
                              {prescription.quantity}
                            </div>
                          </div>
                          {prescription.special_instructions && (
                            <p className="text-xs text-muted-foreground">
                              <span className="font-medium">Instructions:</span>{' '}
                              {prescription.special_instructions}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Visit Summary */}
              {visitSummary && (
                <>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Visit Summary</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {visitSummary}
                    </p>
                  </div>
                </>
              )}

              {/* Follow-up Recommendations */}
              {followUpRecommendations && (
                <>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Follow-up Recommendations</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {followUpRecommendations}
                    </p>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
