import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BedList } from '@/components/beds/BedList';
import { BedMap } from '@/components/beds/BedMap';
import { BedAllocationForm } from '@/components/beds/BedAllocationForm';
import { BedOccupancyHistory } from '@/components/beds/BedOccupancyHistory';
import { Bed } from '@/types/models';
import { BedStatus } from '@/types/enums';
import {
  generateMockBeds,
  generateMockPatients,
  generateMockBedAllocations,
  getBedStatistics,
} from '@/lib/mockData';
import { Plus, Bed as BedIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function BedManagement() {
  const { toast } = useToast();
  const [beds, setBeds] = useState(() => generateMockBeds());
  const [patients] = useState(() => generateMockPatients(20));
  const [allocations, setAllocations] = useState(() =>
    generateMockBedAllocations(beds, patients)
  );
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);
  const [showAllocationDialog, setShowAllocationDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);

  const stats = getBedStatistics(beds);

  const handleAllocateBed = (bed: Bed) => {
    setSelectedBed(bed);
    setShowAllocationDialog(true);
  };

  const handleAllocationSubmit = (data: any) => {
    // Mock allocation
    const newAllocation = {
      id: `allocation-${Date.now()}`,
      bed_id: data.bed_id,
      patient_id: data.patient_id,
      visit_id: data.visit_id,
      allocated_at: new Date(),
      expected_discharge_date: data.expected_discharge_date,
      actual_discharge_date: undefined,
      allocated_by: 'current-user',
      notes: data.notes,
    };

    setAllocations([...allocations, newAllocation]);

    // Update bed status
    setBeds(
      beds.map((bed) =>
        bed.id === data.bed_id ? { ...bed, status: BedStatus.OCCUPIED } : bed
      )
    );

    setShowAllocationDialog(false);
    setSelectedBed(null);

    toast({
      title: 'Bed Allocated',
      description: 'The bed has been successfully allocated to the patient.',
    });
  };

  const handleBedClick = (bed: Bed) => {
    setSelectedBed(bed);
    setShowHistoryDialog(true);
  };

  const handleEditBed = (_bed: Bed) => {
    toast({
      title: 'Edit Bed',
      description: 'Edit bed functionality would be implemented here.',
    });
  };

  const handleDeleteBed = (_bedId: string) => {
    toast({
      title: 'Delete Bed',
      description: 'Delete bed functionality would be implemented here.',
      variant: 'destructive',
    });
  };

  const bedHistory = selectedBed
    ? allocations.filter((a) => a.bed_id === selectedBed.id)
    : [];

  const patientsMap = patients.reduce((acc, patient) => {
    acc[patient.id] = patient;
    return acc;
  }, {} as Record<string, any>);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Bed Management</h1>
          <p className="text-muted-foreground">
            Manage hospital beds, allocations, and occupancy
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Bed
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Beds</CardTitle>
            <BedIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <div className="h-3 w-3 rounded-full bg-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.available}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.available / stats.total) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupied</CardTitle>
            <div className="h-3 w-3 rounded-full bg-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.occupied}</div>
            <p className="text-xs text-muted-foreground">
              {stats.occupancyRate.toFixed(1)}% occupancy rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
            <div className="h-3 w-3 rounded-full bg-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.underCleaning + stats.underMaintenance}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.underCleaning} cleaning, {stats.underMaintenance} maintenance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="map">Floor Map</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bed List</CardTitle>
              <CardDescription>
                View and manage all hospital beds with filtering options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BedList
                beds={beds}
                onEdit={handleEditBed}
                onDelete={handleDeleteBed}
                onAllocate={handleAllocateBed}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="map" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Floor Map</CardTitle>
              <CardDescription>
                Visual representation of bed locations and status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BedMap beds={beds} onBedClick={handleBedClick} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Allocation Dialog */}
      <Dialog open={showAllocationDialog} onOpenChange={setShowAllocationDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Allocate Bed</DialogTitle>
          </DialogHeader>
          <BedAllocationForm
            bed={selectedBed || undefined}
            patients={patients}
            onSubmit={handleAllocationSubmit}
            onCancel={() => {
              setShowAllocationDialog(false);
              setSelectedBed(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              Bed History - {selectedBed?.bed_number}
            </DialogTitle>
          </DialogHeader>
          <BedOccupancyHistory allocations={bedHistory} patients={patientsMap} />
        </DialogContent>
      </Dialog>
      </div>
    </MainLayout>
  );
}
