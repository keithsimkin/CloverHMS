import { useState } from 'react';
import { HospitalChargesConfig } from '@/components/financial/HospitalChargesConfig';
import { HospitalCharge } from '@/types/models';
import { useToast } from '@/hooks/use-toast';

const mockCharges: HospitalCharge[] = [
  {
    id: '1',
    service_name: 'General Consultation',
    service_category: 'Consultation',
    charge_amount: 500,
    department: 'OPD',
    effective_from: new Date('2024-01-01'),
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
  },
  {
    id: '2',
    service_name: 'Specialist Consultation',
    service_category: 'Consultation',
    charge_amount: 1000,
    department: 'OPD',
    effective_from: new Date('2024-01-01'),
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
  },
  {
    id: '3',
    service_name: 'Complete Blood Count (CBC)',
    service_category: 'Laboratory',
    charge_amount: 300,
    department: 'Laboratory',
    effective_from: new Date('2024-01-01'),
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
  },
  {
    id: '4',
    service_name: 'X-Ray Chest',
    service_category: 'Radiology',
    charge_amount: 800,
    department: 'Radiology',
    effective_from: new Date('2024-01-01'),
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
  },
  {
    id: '5',
    service_name: 'General Ward Bed (per day)',
    service_category: 'Bed Charges',
    charge_amount: 1500,
    department: 'IPD',
    effective_from: new Date('2024-01-01'),
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
  },
  {
    id: '6',
    service_name: 'ICU Bed (per day)',
    service_category: 'Bed Charges',
    charge_amount: 5000,
    department: 'ICU',
    effective_from: new Date('2024-01-01'),
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
  },
];

export default function HospitalCharges() {
  const { toast } = useToast();
  const [charges, setCharges] = useState<HospitalCharge[]>(mockCharges);

  const handleAddCharge = (chargeData: Partial<HospitalCharge>) => {
    const newCharge: HospitalCharge = {
      id: `charge-${Date.now()}`,
      service_name: chargeData.service_name!,
      service_category: chargeData.service_category!,
      charge_amount: chargeData.charge_amount!,
      department: chargeData.department,
      effective_from: chargeData.effective_from || new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    };
    setCharges([...charges, newCharge]);
    toast({
      title: 'Success',
      description: 'Hospital charge added successfully',
    });
  };

  const handleUpdateCharge = (id: string, chargeData: Partial<HospitalCharge>) => {
    setCharges((prev) =>
      prev.map((charge) =>
        charge.id === id
          ? { ...charge, ...chargeData, updated_at: new Date() }
          : charge
      )
    );
    toast({
      title: 'Success',
      description: 'Hospital charge updated successfully',
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Hospital Charges Configuration</h1>
        <p className="text-muted-foreground">
          Configure and manage service pricing and hospital charges
        </p>
      </div>

      <HospitalChargesConfig
        charges={charges}
        onAddCharge={handleAddCharge}
        onUpdateCharge={handleUpdateCharge}
      />
    </div>
  );
}
