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
import { Input } from '@/components/ui/input';
import { Edit, Trash2, Search } from 'lucide-react';
import { DoctorOPDCharge, Staff } from '@/types/models';
import { format } from 'date-fns';

interface DoctorChargeListProps {
  charges: DoctorOPDCharge[];
  doctors: Staff[];
  onEdit: (charge: DoctorOPDCharge) => void;
  onDelete: (id: string) => void;
}

export function DoctorChargeList({
  charges,
  doctors,
  onEdit,
  onDelete,
}: DoctorChargeListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const getDoctorName = (doctorId: string) => {
    const doctor = doctors.find((d) => d.id === doctorId);
    return doctor ? `Dr. ${doctor.first_name} ${doctor.last_name}` : 'Unknown';
  };

  const filteredCharges = charges.filter((charge) => {
    const doctorName = getDoctorName(charge.doctor_id).toLowerCase();
    const specialization = charge.specialization.toLowerCase();
    const search = searchTerm.toLowerCase();
    return doctorName.includes(search) || specialization.includes(search);
  });

  const isActive = (charge: DoctorOPDCharge) => {
    const now = new Date();
    const effectiveFrom = new Date(charge.effective_from);
    const effectiveUntil = charge.effective_until
      ? new Date(charge.effective_until)
      : null;

    return (
      effectiveFrom <= now && (!effectiveUntil || effectiveUntil >= now)
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by doctor or specialization..."
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
              <TableHead>Doctor</TableHead>
              <TableHead>Specialization</TableHead>
              <TableHead>Consultation Fee</TableHead>
              <TableHead>Follow-up Fee</TableHead>
              <TableHead>Effective From</TableHead>
              <TableHead>Effective Until</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCharges.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">
                  No doctor charges configured
                </TableCell>
              </TableRow>
            ) : (
              filteredCharges.map((charge) => (
                <TableRow key={charge.id}>
                  <TableCell className="font-medium">
                    {getDoctorName(charge.doctor_id)}
                  </TableCell>
                  <TableCell>{charge.specialization}</TableCell>
                  <TableCell>${charge.consultation_fee.toFixed(2)}</TableCell>
                  <TableCell>${charge.follow_up_fee.toFixed(2)}</TableCell>
                  <TableCell>
                    {format(new Date(charge.effective_from), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    {charge.effective_until
                      ? format(new Date(charge.effective_until), 'MMM dd, yyyy')
                      : 'Indefinite'}
                  </TableCell>
                  <TableCell>
                    {isActive(charge) ? (
                      <span className="text-success font-medium">Active</span>
                    ) : (
                      <span className="text-muted-foreground">Inactive</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(charge)}
                        title="Edit charges"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(charge.id)}
                        title="Delete charges"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
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
