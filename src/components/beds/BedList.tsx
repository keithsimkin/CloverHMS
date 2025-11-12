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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Bed } from '@/types/models';
import { BedStatus, BedType } from '@/types/enums';
import { Edit, Trash2, UserPlus } from 'lucide-react';

interface BedListProps {
  beds: Bed[];
  onEdit?: (bed: Bed) => void;
  onDelete?: (bedId: string) => void;
  onAllocate?: (bed: Bed) => void;
}

const statusColors: Record<BedStatus, string> = {
  [BedStatus.AVAILABLE]: 'bg-green-500/10 text-green-500 border-green-500/20',
  [BedStatus.OCCUPIED]: 'bg-red-500/10 text-red-500 border-red-500/20',
  [BedStatus.UNDER_CLEANING]: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  [BedStatus.UNDER_MAINTENANCE]: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  [BedStatus.RESERVED]: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
};

export function BedList({ beds, onEdit, onDelete, onAllocate }: BedListProps) {
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterFloor, setFilterFloor] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Get unique values for filters
  const departments = Array.from(new Set(beds.map((b) => b.department)));
  const floors = Array.from(new Set(beds.map((b) => b.floor.toString())));

  // Apply filters
  const filteredBeds = beds.filter((bed) => {
    if (filterDepartment !== 'all' && bed.department !== filterDepartment) return false;
    if (filterFloor !== 'all' && bed.floor.toString() !== filterFloor) return false;
    if (filterType !== 'all' && bed.bed_type !== filterType) return false;
    if (filterStatus !== 'all' && bed.status !== filterStatus) return false;
    if (searchQuery && !bed.bed_number.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !bed.room_number.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <Input
          placeholder="Search bed number or room..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
        />
        <Select value={filterDepartment} onValueChange={setFilterDepartment}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterFloor} onValueChange={setFilterFloor}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Floor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Floors</SelectItem>
            {floors.map((floor) => (
              <SelectItem key={floor} value={floor}>
                Floor {floor}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {Object.values(BedType).map((type) => (
              <SelectItem key={type} value={type}>
                {type.replace('_', ' ').toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {Object.values(BedStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {status.replace('_', ' ').toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bed Number</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Floor</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Daily Rate</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBeds.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">
                  No beds found
                </TableCell>
              </TableRow>
            ) : (
              filteredBeds.map((bed) => (
                <TableRow key={bed.id}>
                  <TableCell className="font-medium">{bed.bed_number}</TableCell>
                  <TableCell>{bed.bed_type.replace('_', ' ').toUpperCase()}</TableCell>
                  <TableCell>{bed.department}</TableCell>
                  <TableCell>{bed.floor}</TableCell>
                  <TableCell>{bed.room_number}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColors[bed.status]}>
                      {bed.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>${bed.daily_rate.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {bed.status === BedStatus.AVAILABLE && onAllocate && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onAllocate(bed)}
                        >
                          <UserPlus className="h-4 w-4" />
                        </Button>
                      )}
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(bed)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(bed.id)}
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

      {/* Summary */}
      <div className="flex gap-4 text-sm text-muted-foreground">
        <span>Total: {filteredBeds.length} beds</span>
        <span>Available: {filteredBeds.filter((b) => b.status === BedStatus.AVAILABLE).length}</span>
        <span>Occupied: {filteredBeds.filter((b) => b.status === BedStatus.OCCUPIED).length}</span>
      </div>
    </div>
  );
}
