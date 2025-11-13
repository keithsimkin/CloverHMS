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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PackageList } from '@/components/services/PackageList';
import { PackageForm } from '@/components/services/PackageForm';
import { PackageSubscriptionList } from '@/components/services/PackageSubscriptionList';
import { ServicePackage, PackageSubscription } from '@/types/models';
import {
  generateMockServicePackages,
  generateMockPackageSubscriptions,
  generateMockPatients,
} from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';

export default function ServicePackages() {
  const { toast } = useToast();
  const [packages, setPackages] = useState<ServicePackage[]>(
    generateMockServicePackages()
  );
  const [patients] = useState(generateMockPatients(20));
  const [subscriptions, setSubscriptions] = useState<PackageSubscription[]>(() =>
    generateMockPackageSubscriptions(generateMockServicePackages(), patients)
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<ServicePackage | undefined>();
  const [selectedSubscription, setSelectedSubscription] = useState<
    PackageSubscription | undefined
  >();

  const handleCreatePackage = () => {
    setEditingPackage(undefined);
    setIsFormOpen(true);
  };

  const handleEditPackage = (pkg: ServicePackage) => {
    setEditingPackage(pkg);
    setIsFormOpen(true);
  };

  const handleDeletePackage = (id: string) => {
    setPackages(packages.filter((p) => p.id !== id));
    toast({
      title: 'Package deleted',
      description: 'The service package has been deleted successfully.',
    });
  };

  const handleSubmitPackage = (data: Partial<ServicePackage>) => {
    if (editingPackage) {
      // Update existing package
      setPackages(
        packages.map((p) =>
          p.id === editingPackage.id
            ? { ...p, ...data, updated_at: new Date() }
            : p
        )
      );
      toast({
        title: 'Package updated',
        description: 'The service package has been updated successfully.',
      });
    } else {
      // Create new package
      const newPackage: ServicePackage = {
        id: `pkg-${Date.now()}`,
        package_name: data.package_name!,
        description: data.description!,
        included_services: data.included_services || [],
        package_price: data.package_price!,
        validity_days: data.validity_days!,
        discount_percentage: data.discount_percentage,
        status: data.status!,
        created_at: new Date(),
        updated_at: new Date(),
      };
      setPackages([...packages, newPackage]);
      toast({
        title: 'Package created',
        description: 'The service package has been created successfully.',
      });
    }
    setIsFormOpen(false);
    setEditingPackage(undefined);
  };

  const handleViewSubscriptionDetails = (subscription: PackageSubscription) => {
    setSelectedSubscription(subscription);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Service Packages</h1>
          <p className="text-muted-foreground">
            Manage service packages and track subscriptions
          </p>
        </div>
        <Button onClick={handleCreatePackage}>
          <Plus className="mr-2 h-4 w-4" />
          Create Package
        </Button>
      </div>

      <Tabs defaultValue="packages" className="space-y-4">
        <TabsList>
          <TabsTrigger value="packages">Packages</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
        </TabsList>

        <TabsContent value="packages" className="space-y-4">
          <PackageList
            packages={packages}
            onEdit={handleEditPackage}
            onDelete={handleDeletePackage}
          />
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-4">
          <PackageSubscriptionList
            subscriptions={subscriptions}
            patients={patients}
            packages={packages}
            onViewDetails={handleViewSubscriptionDetails}
          />
        </TabsContent>
      </Tabs>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPackage ? 'Edit Service Package' : 'Create Service Package'}
            </DialogTitle>
            <DialogDescription>
              {editingPackage
                ? 'Update the service package details below.'
                : 'Create a new service package with included services and pricing.'}
            </DialogDescription>
          </DialogHeader>
          <PackageForm
            initialData={editingPackage}
            onSubmit={handleSubmitPackage}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingPackage(undefined);
            }}
          />
        </DialogContent>
      </Dialog>

      {selectedSubscription && (
        <Dialog
          open={!!selectedSubscription}
          onOpenChange={() => setSelectedSubscription(undefined)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Subscription Details</DialogTitle>
              <DialogDescription>
                View detailed information about this package subscription.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Services Used:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {selectedSubscription.services_used.map((service, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      {service}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Remaining Services:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {selectedSubscription.remaining_services.map((service, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      {service}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
