import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DoctorChargeList } from '@/components/services/DoctorChargeList';
import { DoctorChargeForm } from '@/components/services/DoctorChargeForm';
import { DoctorOPDCharge } from '@/types/models';
import {
  generateMockStaff,
  generateMockDoctorOPDCharges,
} from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';

export default function DoctorCharges() {
  const { toast } = useToast();
  const [doctors] = useState(generateMockStaff(20));
  const [charges, setCharges] = useState<DoctorOPDCharge[]>(() =>
    generateMockDoctorOPDCharges(doctors)
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCharge, setEditingCharge] = useState<DoctorOPDCharge | undefined>();

  const handleCreateCharge = () => {
    setEditingCharge(undefined);
    setIsFormOpen(true);
  };

  const handleEditCharge = (charge: DoctorOPDCharge) => {
    setEditingCharge(charge);
    setIsFormOpen(true);
  };

  const handleDeleteCharge = (id: string) => {
    setCharges(charges.filter((c) => c.id !== id));
    toast({
      title: 'Charges deleted',
      description: 'The doctor OPD charges have been deleted successfully.',
    });
  };

  const handleSubmitCharge = (data: Partial<DoctorOPDCharge>) => {
    if (editingCharge) {
      // Update existing charge
      setCharges(
        charges.map((c) =>
          c.id === editingCharge.id ? { ...c, ...data } : c
        )
      );
      toast({
        title: 'Charges updated',
        description: 'The doctor OPD charges have been updated successfully.',
      });
    } else {
      // Create new charge
      const newCharge: DoctorOPDCharge = {
        id: `charge-${Date.now()}`,
        doctor_id: data.doctor_id!,
        specialization: data.specialization!,
        consultation_fee: data.consultation_fee!,
        follow_up_fee: data.follow_up_fee!,
        effective_from: data.effective_from!,
        effective_until: data.effective_until,
      };
      setCharges([...charges, newCharge]);
      toast({
        title: 'Charges created',
        description: 'The doctor OPD charges have been set successfully.',
      });
    }
    setIsFormOpen(false);
    setEditingCharge(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Doctor OPD Charges</h1>
          <p className="text-muted-foreground">
            Configure consultation and follow-up fees for doctors
          </p>
        </div>
        <Button onClick={handleCreateCharge}>
          <Plus className="mr-2 h-4 w-4" />
          Set Charges
        </Button>
      </div>

      <DoctorChargeList
        charges={charges}
        doctors={doctors}
        onEdit={handleEditCharge}
        onDelete={handleDeleteCharge}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCharge ? 'Edit Doctor Charges' : 'Set Doctor Charges'}
            </DialogTitle>
            <DialogDescription>
              {editingCharge
                ? 'Update the doctor OPD charges below.'
                : 'Configure consultation and follow-up fees for a doctor.'}
            </DialogDescription>
          </DialogHeader>
          <DoctorChargeForm
            initialData={editingCharge}
            doctors={doctors}
            onSubmit={handleSubmitCharge}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingCharge(undefined);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
