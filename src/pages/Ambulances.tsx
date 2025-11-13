import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AmbulanceList } from '@/components/emergency/AmbulanceList';
import { AmbulanceForm } from '@/components/emergency/AmbulanceForm';
import { Ambulance } from '@/types/models';
import { AmbulanceStatus } from '@/types/enums';
import { PlusIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data for demonstration
const mockAmbulances: Ambulance[] = [
  {
    id: '1',
    vehicle_number: 'AMB-001',
    driver_name: 'John Smith',
    driver_contact: '+1234567890',
    status: AmbulanceStatus.AVAILABLE,
    last_maintenance_date: new Date('2024-01-15'),
    next_maintenance_date: new Date('2024-04-15'),
    created_at: new Date('2023-01-01'),
    updated_at: new Date('2024-01-15'),
  },
  {
    id: '2',
    vehicle_number: 'AMB-002',
    driver_name: 'Sarah Johnson',
    driver_contact: '+1234567891',
    status: AmbulanceStatus.ON_CALL,
    last_maintenance_date: new Date('2024-02-01'),
    next_maintenance_date: new Date('2024-05-01'),
    created_at: new Date('2023-01-01'),
    updated_at: new Date('2024-02-01'),
  },
  {
    id: '3',
    vehicle_number: 'AMB-003',
    driver_name: 'Michael Brown',
    driver_contact: '+1234567892',
    status: AmbulanceStatus.UNDER_MAINTENANCE,
    last_maintenance_date: new Date('2024-03-10'),
    next_maintenance_date: new Date('2024-06-10'),
    created_at: new Date('2023-01-01'),
    updated_at: new Date('2024-03-10'),
  },
  {
    id: '4',
    vehicle_number: 'AMB-004',
    driver_name: 'Emily Davis',
    driver_contact: '+1234567893',
    status: AmbulanceStatus.AVAILABLE,
    last_maintenance_date: new Date('2024-01-20'),
    next_maintenance_date: new Date('2024-04-20'),
    created_at: new Date('2023-01-01'),
    updated_at: new Date('2024-01-20'),
  },
];

export default function Ambulances() {
  const [ambulances, setAmbulances] = useState<Ambulance[]>(mockAmbulances);
  const [showForm, setShowForm] = useState(false);
  const [selectedAmbulance, setSelectedAmbulance] = useState<Ambulance | undefined>();
  const { toast } = useToast();

  const handleAddAmbulance = () => {
    setSelectedAmbulance(undefined);
    setShowForm(true);
  };

  const handleEditAmbulance = (ambulance: Ambulance) => {
    setSelectedAmbulance(ambulance);
    setShowForm(true);
  };

  const handleSubmit = (data: any) => {
    if (selectedAmbulance) {
      // Update existing ambulance
      setAmbulances(
        ambulances.map((amb) =>
          amb.id === selectedAmbulance.id
            ? { ...amb, ...data, updated_at: new Date() }
            : amb
        )
      );
      toast({
        title: 'Ambulance Updated',
        description: 'Ambulance information has been updated successfully.',
      });
    } else {
      // Add new ambulance
      const newAmbulance: Ambulance = {
        id: Date.now().toString(),
        ...data,
        created_at: new Date(),
        updated_at: new Date(),
      };
      setAmbulances([...ambulances, newAmbulance]);
      toast({
        title: 'Ambulance Added',
        description: 'New ambulance has been added to the fleet.',
      });
    }
    setShowForm(false);
    setSelectedAmbulance(undefined);
  };

  const handleViewMaintenance = (ambulance: Ambulance) => {
    toast({
      title: 'Maintenance Schedule',
      description: `Last: ${ambulance.last_maintenance_date?.toLocaleDateString() || 'N/A'}, Next: ${ambulance.next_maintenance_date?.toLocaleDateString() || 'N/A'}`,
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ambulance Management</h1>
          <p className="text-muted-foreground">
            Manage ambulance fleet and track availability
          </p>
        </div>
        <Button onClick={handleAddAmbulance}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Ambulance
        </Button>
      </div>

      <AmbulanceList
        ambulances={ambulances}
        onEdit={handleEditAmbulance}
        onViewMaintenance={handleViewMaintenance}
      />

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedAmbulance ? 'Edit Ambulance' : 'Add New Ambulance'}
            </DialogTitle>
          </DialogHeader>
          <AmbulanceForm
            ambulance={selectedAmbulance}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setSelectedAmbulance(undefined);
            }}
          />
        </DialogContent>
      </Dialog>
      </div>
    </MainLayout>
  );
}
