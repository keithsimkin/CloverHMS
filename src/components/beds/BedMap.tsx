import { Bed } from '@/types/models';
import { BedStatus } from '@/types/enums';
import { cn } from '@/lib/utils';

interface BedMapProps {
  beds: Bed[];
  onBedClick?: (bed: Bed) => void;
}

const statusColors: Record<BedStatus, string> = {
  [BedStatus.AVAILABLE]: 'bg-green-500 hover:bg-green-600',
  [BedStatus.OCCUPIED]: 'bg-red-500 hover:bg-red-600',
  [BedStatus.UNDER_CLEANING]: 'bg-yellow-500 hover:bg-yellow-600',
  [BedStatus.UNDER_MAINTENANCE]: 'bg-orange-500 hover:bg-orange-600',
  [BedStatus.RESERVED]: 'bg-blue-500 hover:bg-blue-600',
};

export function BedMap({ beds, onBedClick }: BedMapProps) {
  // Group beds by floor and department
  const bedsByFloor = beds.reduce((acc, bed) => {
    if (!acc[bed.floor]) {
      acc[bed.floor] = {};
    }
    if (!acc[bed.floor][bed.department]) {
      acc[bed.floor][bed.department] = [];
    }
    acc[bed.floor][bed.department].push(bed);
    return acc;
  }, {} as Record<number, Record<string, Bed[]>>);

  const floors = Object.keys(bedsByFloor)
    .map(Number)
    .sort((a, b) => b - a); // Descending order

  return (
    <div className="space-y-6">
      {floors.map((floor) => (
        <div key={floor} className="space-y-4">
          <h3 className="text-lg font-heading font-semibold">Floor {floor}</h3>
          <div className="grid gap-6">
            {Object.entries(bedsByFloor[floor]).map(([department, deptBeds]) => (
              <div key={department} className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  {department}
                </h4>
                <div className="grid grid-cols-8 gap-2">
                  {deptBeds.map((bed) => (
                    <button
                      key={bed.id}
                      onClick={() => onBedClick?.(bed)}
                      title={`${bed.bed_number} - ${bed.room_number} - ${bed.bed_type.replace('_', ' ').toUpperCase()} - ${bed.status.replace('_', ' ').toUpperCase()}`}
                      className={cn(
                        'aspect-square rounded-md transition-colors flex items-center justify-center text-xs font-medium text-white',
                        statusColors[bed.status],
                        onBedClick && 'cursor-pointer'
                      )}
                    >
                      {bed.bed_number}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Legend */}
      <div className="flex flex-wrap gap-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-500" />
          <span className="text-sm text-muted-foreground">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-500" />
          <span className="text-sm text-muted-foreground">Occupied</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-500" />
          <span className="text-sm text-muted-foreground">Under Cleaning</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-orange-500" />
          <span className="text-sm text-muted-foreground">Under Maintenance</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-500" />
          <span className="text-sm text-muted-foreground">Reserved</span>
        </div>
      </div>
    </div>
  );
}
