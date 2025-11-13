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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Ambulance } from '@/types/models';
import { AmbulanceStatus } from '@/types/enums';
import { PencilIcon, CalendarIcon } from 'lucide-react';

interface AmbulanceListProps {
  ambulances: Ambulance[];
  onEdit: (ambulance: Ambulance) => void;
  onViewMaintenance: (ambulance: Ambulance) => void;
}

export function AmbulanceList({ ambulances, onEdit, onViewMaintenance }: AmbulanceListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AmbulanceStatus | 'all'>('all');

  const getStatusBadgeVariant = (status: AmbulanceStatus) => {
    switch (status) {
      case 'available':
        return 'default';
      case 'on_call':
        return 'secondary';
      case 'under_maintenance':
        return 'outline';
      case 'out_of_service':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: AmbulanceStatus) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
  };

  const filteredAmbulances = ambulances.filter((ambulance) => {
    const matchesSearch =
      ambulance.vehicle_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ambulance.driver_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ambulance.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (date?: Date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ambulance Fleet</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-4">
          <Input
            placeholder="Search by vehicle number or driver..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as AmbulanceStatus | 'all')}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value={AmbulanceStatus.AVAILABLE}>Available</SelectItem>
              <SelectItem value={AmbulanceStatus.ON_CALL}>On Call</SelectItem>
              <SelectItem value={AmbulanceStatus.UNDER_MAINTENANCE}>Under Maintenance</SelectItem>
              <SelectItem value={AmbulanceStatus.OUT_OF_SERVICE}>Out of Service</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle Number</TableHead>
                <TableHead>Driver Name</TableHead>
                <TableHead>Driver Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Maintenance</TableHead>
                <TableHead>Next Maintenance</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAmbulances.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No ambulances found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAmbulances.map((ambulance) => (
                  <TableRow key={ambulance.id}>
                    <TableCell className="font-medium">{ambulance.vehicle_number}</TableCell>
                    <TableCell>{ambulance.driver_name}</TableCell>
                    <TableCell>{ambulance.driver_contact}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(ambulance.status)}>
                        {getStatusLabel(ambulance.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(ambulance.last_maintenance_date)}</TableCell>
                    <TableCell>{formatDate(ambulance.next_maintenance_date)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(ambulance)}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewMaintenance(ambulance)}
                        >
                          <CalendarIcon className="h-4 w-4" />
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
          Showing {filteredAmbulances.length} of {ambulances.length} ambulances
        </div>
      </CardContent>
    </Card>
  );
}
