import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmergencyCall } from '@/types/models';
import { PhoneIcon, MapPinIcon, ClockIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ActiveEmergencyCallsProps {
  calls: EmergencyCall[];
  onDispatch: (call: EmergencyCall) => void;
  onViewDetails: (call: EmergencyCall) => void;
}

export function ActiveEmergencyCalls({
  calls,
  onDispatch,
  onViewDetails,
}: ActiveEmergencyCallsProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'default';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received':
        return 'destructive';
      case 'dispatched':
        return 'default';
      case 'patient_picked_up':
        return 'secondary';
      case 'arrived_at_hospital':
        return 'outline';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const activeCalls = calls.filter(
    (call) =>
      call.status === 'received' ||
      call.status === 'dispatched' ||
      call.status === 'patient_picked_up'
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Active Emergency Calls</span>
          <Badge variant="destructive">{activeCalls.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activeCalls.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No active emergency calls
          </div>
        ) : (
          <div className="space-y-4">
            {activeCalls.map((call) => (
              <Card key={call.id} className="border-l-4 border-l-destructive">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{call.emergency_type}</h4>
                        <Badge variant={getPriorityColor(call.priority)}>
                          {call.priority.toUpperCase()}
                        </Badge>
                        <Badge variant={getStatusColor(call.status)}>
                          {getStatusLabel(call.status)}
                        </Badge>
                      </div>
                      {call.patient_name && (
                        <p className="text-sm text-muted-foreground">
                          Patient: {call.patient_name}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <ClockIcon className="h-4 w-4" />
                      {formatDistanceToNow(new Date(call.call_time), { addSuffix: true })}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-start gap-2 text-sm">
                      <PhoneIcon className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{call.caller_name}</p>
                        <p className="text-muted-foreground">{call.caller_contact}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-sm">
                      <MapPinIcon className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <p className="text-muted-foreground">{call.location}</p>
                    </div>

                    <p className="text-sm">{call.description}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onViewDetails(call)}
                    >
                      View Details
                    </Button>
                    {call.status === 'received' && (
                      <Button size="sm" onClick={() => onDispatch(call)}>
                        Dispatch Ambulance
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
