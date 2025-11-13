import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PlusIcon } from 'lucide-react';
import { InsuranceProviderList } from '@/components/financial/InsuranceProviderList';
import { PatientInsuranceForm } from '@/components/financial/PatientInsuranceForm';
import { ClaimProcessing } from '@/components/financial/ClaimProcessing';
import type { InsuranceProvider, InsuranceClaim } from '@/types/models';
import { ClaimStatus } from '@/types/enums';
import { useToast } from '@/hooks/use-toast';

// Mock data
const mockProviders: InsuranceProvider[] = [
  {
    id: '1',
    name: 'Blue Cross Health Insurance',
    contact_person: 'John Smith',
    contact_phone: '+1-555-0101',
    contact_email: 'john.smith@bluecross.com',
    address: '123 Insurance Ave, New York, NY 10001',
    coverage_details: 'Comprehensive health coverage including hospitalization, surgery, and outpatient care',
    is_active: true,
    created_at: new Date('2024-01-15'),
    updated_at: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'United Healthcare',
    contact_person: 'Sarah Johnson',
    contact_phone: '+1-555-0102',
    contact_email: 'sarah.j@unitedhc.com',
    address: '456 Medical Plaza, Los Angeles, CA 90001',
    coverage_details: 'Premium health insurance with 80% coverage on all medical procedures',
    is_active: true,
    created_at: new Date('2024-02-01'),
    updated_at: new Date('2024-02-01'),
  },
  {
    id: '3',
    name: 'Aetna Insurance',
    contact_person: 'Michael Brown',
    contact_phone: '+1-555-0103',
    contact_email: 'm.brown@aetna.com',
    address: '789 Health St, Chicago, IL 60601',
    coverage_details: 'Standard coverage with co-pay options',
    is_active: false,
    created_at: new Date('2023-12-10'),
    updated_at: new Date('2024-03-15'),
  },
];

const mockClaims: InsuranceClaim[] = [
  {
    id: '1',
    patient_insurance_id: 'pi-1',
    provider_id: '1',
    billing_record_id: 'br-1',
    claim_number: 'CLM-2024-001',
    claim_date: new Date('2024-03-01'),
    claim_amount: 5000,
    approved_amount: 4500,
    status: ClaimStatus.APPROVED,
    notes: 'Approved with minor adjustments',
    created_at: new Date('2024-03-01'),
    updated_at: new Date('2024-03-05'),
  },
  {
    id: '2',
    patient_insurance_id: 'pi-2',
    provider_id: '2',
    billing_record_id: 'br-2',
    claim_number: 'CLM-2024-002',
    claim_date: new Date('2024-03-10'),
    claim_amount: 3200,
    status: ClaimStatus.PENDING,
    notes: '',
    created_at: new Date('2024-03-10'),
    updated_at: new Date('2024-03-10'),
  },
  {
    id: '3',
    patient_insurance_id: 'pi-3',
    provider_id: '1',
    billing_record_id: 'br-3',
    claim_number: 'CLM-2024-003',
    claim_date: new Date('2024-03-15'),
    claim_amount: 8500,
    approved_amount: 8500,
    status: ClaimStatus.PAID,
    notes: 'Fully approved and paid',
    created_at: new Date('2024-03-15'),
    updated_at: new Date('2024-03-20'),
  },
];

export default function Insurance() {
  const { toast } = useToast();
  const [providers] = useState<InsuranceProvider[]>(mockProviders);
  const [claims, setClaims] = useState<InsuranceClaim[]>(mockClaims);
  const [showInsuranceDialog, setShowInsuranceDialog] = useState(false);

  const handleEditProvider = (_provider: InsuranceProvider) => {
    toast({
      title: 'Info',
      description: 'Provider editing will be available soon',
    });
  };

  const handleAddInsurance = (data: any) => {
    console.log('Add patient insurance:', data);
    toast({
      title: 'Success',
      description: 'Patient insurance added successfully',
    });
    setShowInsuranceDialog(false);
  };

  const handleUpdateClaim = (claimId: string, updates: Partial<InsuranceClaim>) => {
    setClaims((prev) =>
      prev.map((claim) =>
        claim.id === claimId ? { ...claim, ...updates, updated_at: new Date() } : claim
      )
    );
    toast({
      title: 'Success',
      description: 'Claim updated successfully',
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Insurance Management</h1>
          <p className="text-muted-foreground">
            Manage insurance providers, patient insurance, and claims processing
          </p>
        </div>
        <Button onClick={() => setShowInsuranceDialog(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Patient Insurance
        </Button>
      </div>

      <Tabs defaultValue="providers">
        <TabsList>
          <TabsTrigger value="providers">Insurance Providers</TabsTrigger>
          <TabsTrigger value="claims">Claims Processing</TabsTrigger>
        </TabsList>

        <TabsContent value="providers" className="mt-6">
          <InsuranceProviderList providers={providers} onEdit={handleEditProvider} />
        </TabsContent>

        <TabsContent value="claims" className="mt-6">
          <ClaimProcessing
            claims={claims}
            providers={providers}
            onUpdateClaim={handleUpdateClaim}
          />
        </TabsContent>
      </Tabs>

      <Dialog open={showInsuranceDialog} onOpenChange={setShowInsuranceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Patient Insurance</DialogTitle>
          </DialogHeader>
          <PatientInsuranceForm
            providers={providers}
            onSubmit={handleAddInsurance}
            onCancel={() => setShowInsuranceDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
