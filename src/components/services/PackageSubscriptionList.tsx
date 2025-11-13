import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Eye } from 'lucide-react';
import { PackageSubscription, Patient, ServicePackage } from '@/types/models';
import { PackageSubscriptionStatus } from '@/types/enums';
import { format } from 'date-fns';

interface PackageSubscriptionListProps {
  subscriptions: PackageSubscription[];
  patients: Patient[];
  packages: ServicePackage[];
  onViewDetails: (subscription: PackageSubscription) => void;
}

export function PackageSubscriptionList({
  subscriptions,
  patients,
  packages,
  onViewDetails,
}: PackageSubscriptionListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const getPatientName = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId);
    return patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown';
  };

  const getPackageName = (packageId: string) => {
    const pkg = packages.find((p) => p.id === packageId);
    return pkg ? pkg.package_name : 'Unknown';
  };

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const patientName = getPatientName(sub.patient_id).toLowerCase();
    const packageName = getPackageName(sub.package_id).toLowerCase();
    const search = searchTerm.toLowerCase();
    return patientName.includes(search) || packageName.includes(search);
  });

  const getStatusBadge = (status: PackageSubscriptionStatus) => {
    switch (status) {
      case PackageSubscriptionStatus.ACTIVE:
        return (
          <Badge variant="default" className="bg-success">
            Active
          </Badge>
        );
      case PackageSubscriptionStatus.EXPIRED:
        return <Badge variant="secondary">Expired</Badge>;
      case PackageSubscriptionStatus.FULLY_USED:
        return <Badge variant="outline">Fully Used</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by patient or package name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Package</TableHead>
              <TableHead>Purchase Date</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Services Used</TableHead>
              <TableHead>Remaining</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubscriptions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">
                  No subscriptions found
                </TableCell>
              </TableRow>
            ) : (
              filteredSubscriptions.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell className="font-medium">
                    {getPatientName(sub.patient_id)}
                  </TableCell>
                  <TableCell>{getPackageName(sub.package_id)}</TableCell>
                  <TableCell>{format(new Date(sub.purchase_date), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{format(new Date(sub.expiry_date), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {sub.services_used.length} services
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {sub.remaining_services.length} services
                    </span>
                  </TableCell>
                  <TableCell>{getStatusBadge(sub.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewDetails(sub)}
                      title="View details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
