import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ServicePackage } from '@/types/models';
import { PackageStatus } from '@/types/enums';
import { PencilIcon, EyeIcon } from 'lucide-react';

interface ServicePackageListProps {
  packages: ServicePackage[];
  onEdit: (pkg: ServicePackage) => void;
  onView: (pkg: ServicePackage) => void;
}

export function ServicePackageList({ packages, onEdit, onView }: ServicePackageListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPackages = packages.filter((pkg) =>
    pkg.package_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Packages</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Search packages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Package Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Validity</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPackages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No packages found
                  </TableCell>
                </TableRow>
              ) : (
                filteredPackages.map((pkg) => (
                  <TableRow key={pkg.id}>
                    <TableCell className="font-medium">{pkg.package_name}</TableCell>
                    <TableCell className="max-w-xs truncate">{pkg.description}</TableCell>
                    <TableCell>${pkg.package_price.toFixed(2)}</TableCell>
                    <TableCell>{pkg.validity_days} days</TableCell>
                    <TableCell>
                      {pkg.discount_percentage ? `${pkg.discount_percentage}%` : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={pkg.status === PackageStatus.ACTIVE ? 'default' : 'secondary'}>
                        {pkg.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onView(pkg)}
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(pkg)}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          Showing {filteredPackages.length} of {packages.length} packages
        </div>
      </CardContent>
    </Card>
  );
}
