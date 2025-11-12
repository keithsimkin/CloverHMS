/**
 * Billing Page
 * Manages billing and payment recording for patient visits
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { BillingForm } from '@/components/billing/BillingForm';
import { useToast } from '@/hooks/use-toast';
import type { BillingRecord, Patient, PatientFlow } from '@/types/models';
import { Gender, BloodType, FlowStage, PaymentStatus, PaymentMethod } from '@/types/enums';
import { 
  CreditCardIcon, 
  MagnifyingGlassIcon, 
  DocumentTextIcon,
  PrinterIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

// Mock data for pending bills
const mockPendingBills: Array<BillingRecord & { patient: Patient; flow: PatientFlow }> = [
  {
    id: '1',
    patient_id: 'p1',
    visit_id: 'v1',
    flow_id: 'f1',
    consultation_fee: 150.00,
    medication_cost: 75.50,
    laboratory_cost: 200.00,
    procedure_cost: 0,
    total_amount: 425.50,
    payment_status: PaymentStatus.PENDING,
    billing_date: new Date('2024-01-15T10:30:00'),
    processed_by: 'staff1',
    patient: {
      id: 'p1',
      patient_id: 'PAT001',
      first_name: 'John',
      last_name: 'Doe',
      date_of_birth: new Date('1985-05-15'),
      gender: Gender.MALE,
      contact_phone: '+1234567890',
      contact_email: 'john.doe@email.com',
      address: '123 Main St',
      emergency_contact_name: 'Jane Doe',
      emergency_contact_phone: '+1234567891',
      blood_type: BloodType.O_POSITIVE,
      created_at: new Date(),
      updated_at: new Date(),
      created_by: 'admin',
    },
    flow: {
      id: 'f1',
      patient_id: 'p1',
      visit_id: 'v1',
      current_stage: FlowStage.BILLING,
      arrival_time: new Date('2024-01-15T08:00:00'),
      created_at: new Date(),
      updated_at: new Date(),
    },
  },
  {
    id: '2',
    patient_id: 'p2',
    visit_id: 'v2',
    flow_id: 'f2',
    consultation_fee: 200.00,
    medication_cost: 120.00,
    laboratory_cost: 350.00,
    procedure_cost: 500.00,
    total_amount: 1170.00,
    payment_status: PaymentStatus.PARTIAL,
    payment_method: PaymentMethod.CASH,
    paid_amount: 500.00,
    billing_date: new Date('2024-01-15T11:00:00'),
    processed_by: 'staff1',
    patient: {
      id: 'p2',
      patient_id: 'PAT002',
      first_name: 'Sarah',
      last_name: 'Smith',
      date_of_birth: new Date('1990-08-22'),
      gender: Gender.FEMALE,
      contact_phone: '+1234567892',
      address: '456 Oak Ave',
      emergency_contact_name: 'Mike Smith',
      emergency_contact_phone: '+1234567893',
      created_at: new Date(),
      updated_at: new Date(),
      created_by: 'admin',
    },
    flow: {
      id: 'f2',
      patient_id: 'p2',
      visit_id: 'v2',
      current_stage: FlowStage.BILLING,
      arrival_time: new Date('2024-01-15T09:00:00'),
      created_at: new Date(),
      updated_at: new Date(),
    },
  },
  {
    id: '3',
    patient_id: 'p3',
    visit_id: 'v3',
    flow_id: 'f3',
    consultation_fee: 150.00,
    medication_cost: 0,
    laboratory_cost: 180.00,
    procedure_cost: 0,
    total_amount: 330.00,
    payment_status: PaymentStatus.PAID,
    payment_method: PaymentMethod.CARD,
    paid_amount: 330.00,
    billing_date: new Date('2024-01-15T09:45:00'),
    processed_by: 'staff1',
    patient: {
      id: 'p3',
      patient_id: 'PAT003',
      first_name: 'Michael',
      last_name: 'Johnson',
      date_of_birth: new Date('1978-03-10'),
      gender: Gender.MALE,
      contact_phone: '+1234567894',
      address: '789 Pine Rd',
      emergency_contact_name: 'Lisa Johnson',
      emergency_contact_phone: '+1234567895',
      created_at: new Date(),
      updated_at: new Date(),
      created_by: 'admin',
    },
    flow: {
      id: 'f3',
      patient_id: 'p3',
      visit_id: 'v3',
      current_stage: FlowStage.DISCHARGE,
      arrival_time: new Date('2024-01-15T07:30:00'),
      created_at: new Date(),
      updated_at: new Date(),
    },
  },
];

export default function Billing() {
  const { toast } = useToast();
  const [bills, setBills] = useState(mockPendingBills);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBill, setSelectedBill] = useState<typeof mockPendingBills[0] | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [receiptData, setReceiptData] = useState<typeof mockPendingBills[0] | null>(null);

  // Filter bills based on search query
  const filteredBills = bills.filter((bill) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      bill.patient.patient_id.toLowerCase().includes(searchLower) ||
      bill.patient.first_name.toLowerCase().includes(searchLower) ||
      bill.patient.last_name.toLowerCase().includes(searchLower) ||
      bill.payment_status.toLowerCase().includes(searchLower)
    );
  });

  const handleRecordPayment = (bill: typeof mockPendingBills[0]) => {
    setSelectedBill(bill);
    setIsFormOpen(true);
  };

  const handleBillSubmit = (data: Omit<BillingRecord, 'id' | 'billing_date' | 'processed_by'>) => {
    // In a real app, this would call the API
    const updatedBills = bills.map((bill) =>
      bill.id === selectedBill?.id
        ? {
            ...bill,
            ...data,
            billing_date: new Date(),
            processed_by: 'current_user',
          }
        : bill
    );

    setBills(updatedBills);
    setIsFormOpen(false);
    setSelectedBill(null);

    toast({
      title: 'Payment Recorded',
      description: 'Payment has been successfully recorded.',
    });
  };

  const handleViewReceipt = (bill: typeof mockPendingBills[0]) => {
    setReceiptData(bill);
    setIsReceiptOpen(true);
  };

  const handlePrintReceipt = () => {
    // In a real app, this would generate and print a PDF receipt
    toast({
      title: 'Receipt Printing',
      description: 'Receipt is being prepared for printing...',
    });
  };

  const getPaymentStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PENDING:
        return (
          <Badge variant="outline" className="bg-warning/10 text-warning border-warning">
            <ClockIcon className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case PaymentStatus.PARTIAL:
        return (
          <Badge variant="outline" className="bg-info/10 text-info border-info">
            <ExclamationCircleIcon className="h-3 w-3 mr-1" />
            Partial
          </Badge>
        );
      case PaymentStatus.PAID:
        return (
          <Badge variant="outline" className="bg-success/10 text-success border-success">
            <CheckCircleIcon className="h-3 w-3 mr-1" />
            Paid
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Billing & Payments</h1>
          <p className="text-muted-foreground mt-1">
            Manage patient bills and record payments
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Bills</CardTitle>
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bills.filter((b) => b.payment_status === PaymentStatus.PENDING).length}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting payment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Partial Payments</CardTitle>
            <ExclamationCircleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bills.filter((b) => b.payment_status === PaymentStatus.PARTIAL).length}
            </div>
            <p className="text-xs text-muted-foreground">Partially paid</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bills.filter((b) => b.payment_status === PaymentStatus.PAID).length}
            </div>
            <p className="text-xs text-muted-foreground">Fully paid</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${bills.reduce((sum, b) => sum + (b.paid_amount || 0), 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Today's collection</p>
          </CardContent>
        </Card>
      </div>

      {/* Bills List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Bills & Payments</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by patient ID or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-[300px]"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient ID</TableHead>
                <TableHead>Patient Name</TableHead>
                <TableHead>Bill Date</TableHead>
                <TableHead className="text-right">Total Amount</TableHead>
                <TableHead className="text-right">Paid Amount</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBills.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
                    No bills found
                  </TableCell>
                </TableRow>
              ) : (
                filteredBills.map((bill) => {
                  const balance = bill.total_amount - (bill.paid_amount || 0);
                  return (
                    <TableRow key={bill.id}>
                      <TableCell className="font-medium">{bill.patient.patient_id}</TableCell>
                      <TableCell>
                        {bill.patient.first_name} {bill.patient.last_name}
                      </TableCell>
                      <TableCell>
                        {new Date(bill.billing_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${bill.total_amount.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        ${(bill.paid_amount || 0).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={balance > 0 ? 'text-warning font-medium' : 'text-success'}>
                          ${balance.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell>{getPaymentStatusBadge(bill.payment_status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewReceipt(bill)}
                          >
                            <DocumentTextIcon className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          {bill.payment_status !== PaymentStatus.PAID && (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleRecordPayment(bill)}
                            >
                              <CreditCardIcon className="h-4 w-4 mr-1" />
                              Record Payment
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payment Recording Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
          </DialogHeader>
          {selectedBill && (
            <BillingForm
              patient={selectedBill.patient}
              flow={selectedBill.flow}
              visitId={selectedBill.visit_id}
              existingBill={selectedBill}
              onSubmit={handleBillSubmit}
              onCancel={() => {
                setIsFormOpen(false);
                setSelectedBill(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Receipt Dialog */}
      <Dialog open={isReceiptOpen} onOpenChange={setIsReceiptOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Payment Receipt</DialogTitle>
          </DialogHeader>
          {receiptData && (
            <div className="space-y-6">
              {/* Receipt Header */}
              <div className="text-center border-b pb-4">
                <h2 className="text-2xl font-bold">Hospital Management System</h2>
                <p className="text-sm text-muted-foreground">Payment Receipt</p>
              </div>

              {/* Patient & Bill Information */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Patient Name:</p>
                  <p className="font-medium">
                    {receiptData.patient.first_name} {receiptData.patient.last_name}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Patient ID:</p>
                  <p className="font-medium">{receiptData.patient.patient_id}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Bill Date:</p>
                  <p className="font-medium">
                    {new Date(receiptData.billing_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Receipt No:</p>
                  <p className="font-medium">RCP-{receiptData.id.toUpperCase()}</p>
                </div>
              </div>

              {/* Charge Breakdown */}
              <div className="border rounded-lg p-4 space-y-2">
                <h3 className="font-semibold mb-3">Charge Breakdown</h3>
                {receiptData.consultation_fee && receiptData.consultation_fee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Consultation Fee:</span>
                    <span>${receiptData.consultation_fee.toFixed(2)}</span>
                  </div>
                )}
                {receiptData.medication_cost && receiptData.medication_cost > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Medication Cost:</span>
                    <span>${receiptData.medication_cost.toFixed(2)}</span>
                  </div>
                )}
                {receiptData.laboratory_cost && receiptData.laboratory_cost > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Laboratory Cost:</span>
                    <span>${receiptData.laboratory_cost.toFixed(2)}</span>
                  </div>
                )}
                {receiptData.procedure_cost && receiptData.procedure_cost > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Procedure Cost:</span>
                    <span>${receiptData.procedure_cost.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total Amount:</span>
                    <span>${receiptData.total_amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span>Amount Paid:</span>
                    <span>${(receiptData.paid_amount || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium mt-1">
                    <span>Balance:</span>
                    <span className={receiptData.total_amount - (receiptData.paid_amount || 0) > 0 ? 'text-warning' : 'text-success'}>
                      ${(receiptData.total_amount - (receiptData.paid_amount || 0)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              {receiptData.payment_method && (
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Payment Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Payment Method:</p>
                      <p className="font-medium capitalize">{receiptData.payment_method.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Payment Status:</p>
                      <p className="font-medium capitalize">{receiptData.payment_status}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsReceiptOpen(false)}>
                  Close
                </Button>
                <Button onClick={handlePrintReceipt}>
                  <PrinterIcon className="h-4 w-4 mr-2" />
                  Print Receipt
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
