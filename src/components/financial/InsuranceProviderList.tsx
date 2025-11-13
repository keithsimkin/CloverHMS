import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InsuranceProvider } from '@/types/models';
import { PencilIcon, PhoneIcon, MailIcon } from 'lucide-react';

interface InsuranceProviderListProps {
  providers: InsuranceProvider[];
  onEdit: (provider: InsuranceProvider) => void;
}

export function InsuranceProviderList({ providers, onEdit }: InsuranceProviderListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProviders = providers.filter((provider) =>
    provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.contact_person?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Insurance Providers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Search by provider name or contact person..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Provider Name</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Contact Info</TableHead>
                <TableHead>Coverage Details</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProviders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No insurance providers found
                  </TableCell>
                </TableRow>
              ) : (
                filteredProviders.map((provider) => (
                  <TableRow key={provider.id}>
                    <TableCell className="font-medium">{provider.name}</TableCell>
                    <TableCell>{provider.contact_person || 'N/A'}</TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        {provider.contact_phone && (
                          <div className="flex items-center gap-1">
                            <PhoneIcon className="h-3 w-3 text-muted-foreground" />
                            {provider.contact_phone}
                          </div>
                        )}
                        {provider.contact_email && (
                          <div className="flex items-center gap-1">
                            <MailIcon className="h-3 w-3 text-muted-foreground" />
                            {provider.contact_email}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {provider.coverage_details || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={provider.is_active ? 'default' : 'secondary'}>
                        {provider.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(provider)}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          Showing {filteredProviders.length} of {providers.length} providers
        </div>
      </CardContent>
    </Card>
  );
}
