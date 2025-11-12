import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BloodDonation, BloodInventory as BloodInventoryType } from '@/types/models';
import { BloodType, BloodDonationStatus } from '@/types/enums';
import { AlertTriangle, Droplet } from 'lucide-react';
import { differenceInDays, format } from 'date-fns';

interface BloodInventoryProps {
  inventory: BloodInventoryType[];
  donations: BloodDonation[];
  onRecordUsage?: (bloodType: BloodType) => void;
}

export function BloodInventory({
  inventory,
  donations,
  onRecordUsage,
}: BloodInventoryProps) {
  // Get expiring units (within 7 days)
  const expiringUnits = donations.filter((d) => {
    if (d.status !== BloodDonationStatus.AVAILABLE) return false;
    const daysUntilExpiry = differenceInDays(new Date(d.expiry_date), new Date());
    return daysUntilExpiry <= 7 && daysUntilExpiry >= 0;
  });

  return (
    <div className="space-y-6">
      {/* Alerts */}
      {expiringUnits.length > 0 && (
        <Card className="border-yellow-500/50 bg-yellow-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-500">
              <AlertTriangle className="h-5 w-5" />
              Expiring Blood Units
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {expiringUnits.length} unit(s) expiring within 7 days
            </p>
            <div className="space-y-2">
              {expiringUnits.slice(0, 5).map((unit) => (
                <div
                  key={unit.id}
                  className="flex items-center justify-between text-sm p-2 rounded bg-background"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{unit.blood_type}</Badge>
                    <span>{unit.quantity_ml}ml</span>
                  </div>
                  <span className="text-muted-foreground">
                    Expires: {format(new Date(unit.expiry_date), 'PP')}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inventory Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {inventory.map((item) => {
          const isLowStock = item.available_units < item.minimum_threshold;

          return (
            <Card
              key={item.blood_type}
              className={isLowStock ? 'border-red-500/50 bg-red-500/5' : ''}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-2xl font-bold">{item.blood_type}</CardTitle>
                <Droplet
                  className={`h-6 w-6 ${isLowStock ? 'text-red-500' : 'text-muted-foreground'}`}
                />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Available Units:</span>
                    <span className="font-medium">{item.available_units}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Volume:</span>
                    <span className="font-medium">{item.total_quantity_ml}ml</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Expiring Soon:</span>
                    <span
                      className={`font-medium ${item.expiring_soon_count > 0 ? 'text-yellow-500' : ''}`}
                    >
                      {item.expiring_soon_count}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Min. Threshold:</span>
                    <span className="font-medium">{item.minimum_threshold}</span>
                  </div>
                </div>

                {isLowStock && (
                  <Badge variant="destructive" className="w-full justify-center">
                    Low Stock Alert
                  </Badge>
                )}

                {onRecordUsage && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => onRecordUsage(item.blood_type)}
                    disabled={item.available_units === 0}
                  >
                    Record Usage
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Units</p>
              <p className="text-2xl font-bold">
                {inventory.reduce((sum, item) => sum + item.available_units, 0)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Volume</p>
              <p className="text-2xl font-bold">
                {inventory.reduce((sum, item) => sum + item.total_quantity_ml, 0)}ml
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Low Stock Types</p>
              <p className="text-2xl font-bold text-red-500">
                {inventory.filter((i) => i.available_units < i.minimum_threshold).length}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Expiring Soon</p>
              <p className="text-2xl font-bold text-yellow-500">
                {inventory.reduce((sum, item) => sum + item.expiring_soon_count, 0)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
