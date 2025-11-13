import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DonorList } from '@/components/bloodbank/DonorList';
import { DonorForm } from '@/components/bloodbank/DonorForm';
import { DonorHistory } from '@/components/bloodbank/DonorHistory';
import { DonationForm } from '@/components/bloodbank/DonationForm';
import { BloodDonor, BloodDonation } from '@/types/models';
import {
  generateMockBloodDonors,
  generateMockBloodDonations,
} from '@/lib/mockData';
import { Plus, Droplet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DonorEligibilityStatus } from '@/types/enums';

export function BloodDonors() {
  const { toast } = useToast();
  const [donors, setDonors] = useState(() => generateMockBloodDonors(30));
  const [donations, setDonations] = useState(() => generateMockBloodDonations(donors));
  const [selectedDonor, setSelectedDonor] = useState<BloodDonor | null>(null);
  const [showDonorDialog, setShowDonorDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [showDonationDialog, setShowDonationDialog] = useState(false);

  const eligibleDonors = donors.filter(
    (d) => d.eligibility_status === DonorEligibilityStatus.ELIGIBLE
  );

  const handleAddDonor = () => {
    setSelectedDonor(null);
    setShowDonorDialog(true);
  };

  const handleEditDonor = (donor: BloodDonor) => {
    setSelectedDonor(donor);
    setShowDonorDialog(true);
  };

  const handleViewDonor = (donor: BloodDonor) => {
    setSelectedDonor(donor);
    setShowHistoryDialog(true);
  };

  const handleDeleteDonor = (donorId: string) => {
    setDonors(donors.filter((d) => d.id !== donorId));
    toast({
      title: 'Donor Deleted',
      description: 'The donor has been removed from the system.',
      variant: 'destructive',
    });
  };

  const handleDonorSubmit = (data: any) => {
    if (selectedDonor) {
      setDonors(
        donors.map((d) => (d.id === selectedDonor.id ? { ...d, ...data } : d))
      );
      toast({
        title: 'Donor Updated',
        description: 'Donor information has been updated successfully.',
      });
    } else {
      const newDonor: BloodDonor = {
        id: `donor-${Date.now()}`,
        ...data,
        last_donation_date: undefined,
        eligibility_status: DonorEligibilityStatus.ELIGIBLE,
        total_donations: 0,
        created_at: new Date(),
        updated_at: new Date(),
      };
      setDonors([...donors, newDonor]);
      toast({
        title: 'Donor Registered',
        description: 'New donor has been registered successfully.',
      });
    }
    setShowDonorDialog(false);
    setSelectedDonor(null);
  };

  const handleRecordDonation = (donor: BloodDonor) => {
    setSelectedDonor(donor);
    setShowDonationDialog(true);
  };

  const handleDonationSubmit = (data: any) => {
    const newDonation: BloodDonation = {
      id: `donation-${Date.now()}`,
      ...data,
      status: 'available' as any,
      collected_by: 'current-user',
      usage_date: new Date(),
    };

    setDonations([...donations, newDonation]);

    // Update donor
    if (selectedDonor) {
      setDonors(
        donors.map((d) =>
          d.id === selectedDonor.id
            ? {
                ...d,
                last_donation_date: new Date(),
                total_donations: d.total_donations + 1,
                eligibility_status: DonorEligibilityStatus.DEFERRED,
              }
            : d
        )
      );
    }

    setShowDonationDialog(false);
    setSelectedDonor(null);

    toast({
      title: 'Donation Recorded',
      description: 'Blood donation has been recorded successfully.',
    });
  };

  const donorHistory = selectedDonor
    ? donations.filter((d) => d.donor_id === selectedDonor.id)
    : [];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Blood Donors</h1>
          <p className="text-muted-foreground">
            Manage blood donors and donation records
          </p>
        </div>
        <Button onClick={handleAddDonor}>
          <Plus className="mr-2 h-4 w-4" />
          Register Donor
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donors</CardTitle>
            <Droplet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{donors.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eligible Donors</CardTitle>
            <div className="h-3 w-3 rounded-full bg-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eligibleDonors.length}</div>
            <p className="text-xs text-muted-foreground">
              {((eligibleDonors.length / donors.length) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <Droplet className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{donations.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Donor List */}
      <Card>
        <CardHeader>
          <CardTitle>Donor Registry</CardTitle>
          <CardDescription>
            View and manage all registered blood donors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DonorList
            donors={donors}
            onEdit={handleEditDonor}
            onDelete={handleDeleteDonor}
            onView={handleViewDonor}
          />
        </CardContent>
      </Card>

      {/* Donor Form Dialog */}
      <Dialog open={showDonorDialog} onOpenChange={setShowDonorDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedDonor ? 'Edit Donor' : 'Register New Donor'}
            </DialogTitle>
          </DialogHeader>
          <DonorForm
            donor={selectedDonor || undefined}
            onSubmit={handleDonorSubmit}
            onCancel={() => {
              setShowDonorDialog(false);
              setSelectedDonor(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Donor History Dialog */}
      <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              Donor History - {selectedDonor?.first_name} {selectedDonor?.last_name}
            </DialogTitle>
          </DialogHeader>
          <DonorHistory donations={donorHistory} />
          {selectedDonor?.eligibility_status === DonorEligibilityStatus.ELIGIBLE && (
            <div className="flex justify-end">
              <Button onClick={() => handleRecordDonation(selectedDonor)}>
                <Droplet className="mr-2 h-4 w-4" />
                Record Donation
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Donation Form Dialog */}
      <Dialog open={showDonationDialog} onOpenChange={setShowDonationDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Record Blood Donation</DialogTitle>
          </DialogHeader>
          <DonationForm
            donors={donors}
            selectedDonor={selectedDonor || undefined}
            onSubmit={handleDonationSubmit}
            onCancel={() => {
              setShowDonationDialog(false);
              setSelectedDonor(null);
            }}
          />
        </DialogContent>
      </Dialog>
      </div>
    </MainLayout>
  );
}
