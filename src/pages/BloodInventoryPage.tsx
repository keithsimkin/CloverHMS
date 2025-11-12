import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BloodInventory } from '@/components/bloodbank/BloodInventory';
import { BloodUsageForm } from '@/components/bloodbank/BloodUsageForm';
import { BloodType, BloodDonationStatus } from '@/types/enums';
import {
  generateMockBloodDonors,
  generateMockBloodDonations,
  calculateBloodInventory,
  generateMockPatients,
  generateMockStaff,
} from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';

export function BloodInventoryPage() {
  const { toast } = useToast();
  const [donors] = useState(() => generateMockBloodDonors(30));
  const [donations, setDonations] = useState(() => generateMockBloodDonations(donors));
  const [patients] = useState(() => generateMockPatients(20));
  const [staff] = useState(() => generateMockStaff(20));
  const [selectedBloodType, setSelectedBloodType] = useState<BloodType | null>(null);
  const [showUsageDialog, setShowUsageDialog] = useState(false);

  const inventory = calculateBloodInventory(donations);

  const handleRecordUsage = (bloodType: BloodType) => {
    setSelectedBloodType(bloodType);
    setShowUsageDialog(true);
  };

  const handleUsageSubmit = (data: any) => {
    // Update donation status
    setDonations(
      donations.map((d) =>
        d.id === data.donation_id
          ? { ...d, status: BloodDonationStatus.USED }
          : d
      )
    );

    setShowUsageDialog(false);
    setSelectedBloodType(null);

    toast({
      title: 'Usage Recorded',
      description: 'Blood usage has been recorded successfully.',
    });
  };

  const availableDonations = selectedBloodType
    ? donations.filter(
        (d) =>
          d.blood_type === selectedBloodType &&
          d.status === BloodDonationStatus.AVAILABLE
      )
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold">Blood Inventory</h1>
        <p className="text-muted-foreground">
          Monitor blood stock levels and manage usage
        </p>
      </div>

      {/* Inventory Display */}
      <BloodInventory
        inventory={inventory}
        donations={donations}
        onRecordUsage={handleRecordUsage}
      />

      {/* Usage Form Dialog */}
      <Dialog open={showUsageDialog} onOpenChange={setShowUsageDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Record Blood Usage</DialogTitle>
          </DialogHeader>
          {selectedBloodType && (
            <BloodUsageForm
              bloodType={selectedBloodType}
              availableDonations={availableDonations}
              patients={patients}
              staff={staff}
              onSubmit={handleUsageSubmit}
              onCancel={() => {
                setShowUsageDialog(false);
                setSelectedBloodType(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
