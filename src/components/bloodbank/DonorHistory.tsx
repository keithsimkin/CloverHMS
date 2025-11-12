import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BloodDonation } from '@/types/models';
import { BloodDonationStatus } from '@/types/enums';
import { format } from 'date-fns';

interface DonorHistoryProps {
  donations: BloodDonation[];
}

const statusColors: Record<BloodDonationStatus, string> = {
  [BloodDonationStatus.AVAILABLE]: 'bg-green-500/10 text-green-500 border-green-500/20',
  [BloodDonationStatus.USED]: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  [BloodDonationStatus.EXPIRED]: 'bg-red-500/10 text-red-500 border-red-500/20',
  [BloodDonationStatus.DISCARDED]: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
};

export function DonorHistory({ donations }: DonorHistoryProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-heading font-semibold">Donation History</h3>
      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Blood Type</TableHead>
              <TableHead>Quantity (ml)</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Screening</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {donations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No donation history
                </TableCell>
              </TableRow>
            ) : (
              donations.map((donation) => (
                <TableRow key={donation.id}>
                  <TableCell>{format(new Date(donation.donation_date), 'PPp')}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{donation.blood_type}</Badge>
                  </TableCell>
                  <TableCell>{donation.quantity_ml} ml</TableCell>
                  <TableCell>{format(new Date(donation.expiry_date), 'PP')}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColors[donation.status]}>
                      {donation.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{donation.screening_results || 'Pending'}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {donation.notes || '-'}
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
