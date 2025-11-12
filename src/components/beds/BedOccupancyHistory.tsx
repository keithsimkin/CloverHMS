import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { BedAllocation, Patient } from '@/types/models';
import { format } from 'date-fns';

interface BedOccupancyHistoryProps {
  allocations: BedAllocation[];
  patients?: Record<string, Patient>;
}

export function BedOccupancyHistory({
  allocations,
  patients = {},
}: BedOccupancyHistoryProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-heading font-semibold">Occupancy History</h3>
      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Allocated At</TableHead>
              <TableHead>Expected Discharge</TableHead>
              <TableHead>Actual Discharge</TableHead>
              <TableHead>Duration (Days)</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allocations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No occupancy history
                </TableCell>
              </TableRow>
            ) : (
              allocations.map((allocation) => {
                const patient = patients[allocation.patient_id];
                const duration = allocation.actual_discharge_date
                  ? Math.ceil(
                      (new Date(allocation.actual_discharge_date).getTime() -
                        new Date(allocation.allocated_at).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )
                  : null;

                return (
                  <TableRow key={allocation.id}>
                    <TableCell>
                      {patient
                        ? `${patient.first_name} ${patient.last_name} (${patient.patient_id})`
                        : 'Unknown Patient'}
                    </TableCell>
                    <TableCell>
                      {format(new Date(allocation.allocated_at), 'PPp')}
                    </TableCell>
                    <TableCell>
                      {allocation.expected_discharge_date
                        ? format(new Date(allocation.expected_discharge_date), 'PP')
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {allocation.actual_discharge_date
                        ? format(new Date(allocation.actual_discharge_date), 'PP')
                        : 'Currently Occupied'}
                    </TableCell>
                    <TableCell>{duration !== null ? `${duration} days` : '-'}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {allocation.notes || '-'}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
