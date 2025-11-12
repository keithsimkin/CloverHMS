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
import { BloodDonor } from '@/types/models';
import { DonorEligibilityStatus } from '@/types/enums';
import { Edit, Trash2, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';

interface DonorListProps {
  donors: BloodDonor[];
  onEdit?: (donor: BloodDonor) => void;
  onDelete?: (donorId: string) => void;
  onView?: (donor: BloodDonor) => void;
}

const eligibilityColors: Record<DonorEligibilityStatus, string> = {
  [DonorEligibilityStatus.ELIGIBLE]: 'bg-green-500/10 text-green-500 border-green-500/20',
  [DonorEligibilityStatus.INELIGIBLE]: 'bg-red-500/10 text-red-500 border-red-500/20',
  [DonorEligibilityStatus.DEFERRED]: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
};

export function DonorList({ donors, onEdit, onDelete, onView }: DonorListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDonors = donors.filter((donor) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      donor.donor_id.toLowerCase().includes(query) ||
      donor.first_name.toLowerCase().includes(query) ||
      donor.last_name.toLowerCase().includes(query) ||
      donor.blood_type.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search by donor ID, name, or blood type..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="max-w-md"
      />

      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Donor ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Blood Type</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Last Donation</TableHead>
              <TableHead>Total Donations</TableHead>
              <TableHead>Eligibility</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDonors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">
                  No donors found
                </TableCell>
              </TableRow>
            ) : (
              filteredDonors.map((donor) => (
                <TableRow key={donor.id}>
                  <TableCell className="font-medium">{donor.donor_id}</TableCell>
                  <TableCell>
                    {donor.first_name} {donor.last_name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{donor.blood_type}</Badge>
                  </TableCell>
                  <TableCell>{donor.contact_phone}</TableCell>
                  <TableCell>
                    {donor.last_donation_date
                      ? format(new Date(donor.last_donation_date), 'PP')
                      : 'Never'}
                  </TableCell>
                  <TableCell>{donor.total_donations}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={eligibilityColors[donor.eligibility_status]}
                    >
                      {donor.eligibility_status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {onView && (
                        <Button variant="ghost" size="sm" onClick={() => onView(donor)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      {onEdit && (
                        <Button variant="ghost" size="sm" onClick={() => onEdit(donor)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(donor.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {filteredDonors.length} of {donors.length} donors
      </div>
    </div>
  );
}
