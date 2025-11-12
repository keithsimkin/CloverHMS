import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import LabOrderForm from '@/components/laboratory/LabOrderForm';
import { LabOrderStatus } from '@/types/enums';
import type { LaboratoryOrder, Patient, PatientFlow } from '@/types/models';
import { generateMockPatient, generateMockPatientFlow, generateMockLaboratoryOrder } from '@/lib/mockData';
import { FlaskConical, Search, CheckCircle2, Clock, XCircle, Beaker } from 'lucide-react';

export default function Laboratory() {
  const { toast } = useToast();
  
  // Mock data
  const [mockPatients] = useState<Patient[]>(() => 
    Array.from({ length: 5 }, () => generateMockPatient())
  );
  
  const [mockFlows] = useState<PatientFlow[]>(() =>
    mockPatients.map((patient) => generateMockPatientFlow(patient.id, 'visit-' + patient.id))
  );
  
  const [labOrders, setLabOrders] = useState<LaboratoryOrder[]>(() =>
    mockPatients.flatMap((patient, index) => {
      const flow = mockFlows[index];
      return Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () =>
        generateMockLaboratoryOrder(patient.id, 'visit-' + patient.id, flow.id)
      );
    })
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<LaboratoryOrder | null>(null);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [showCollectionDialog, setShowCollectionDialog] = useState(false);
  const [showResultsDialog, setShowResultsDialog] = useState(false);
  const [resultsText, setResultsText] = useState('');

  // Get patient for an order
  const getPatient = (patientId: string) => {
    return mockPatients.find((p) => p.id === patientId);
  };



  // Filter orders by search term
  const filteredOrders = labOrders.filter((order) => {
    const patient = getPatient(order.patient_id);
    if (!patient) return false;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      patient.first_name.toLowerCase().includes(searchLower) ||
      patient.last_name.toLowerCase().includes(searchLower) ||
      patient.patient_id.toLowerCase().includes(searchLower) ||
      order.test_type.toLowerCase().includes(searchLower) ||
      order.test_name.toLowerCase().includes(searchLower)
    );
  });

  // Group orders by status
  const pendingOrders = filteredOrders.filter((o) => o.status === LabOrderStatus.ORDERED);
  const collectedOrders = filteredOrders.filter((o) => o.status === LabOrderStatus.SAMPLE_COLLECTED);
  const inProgressOrders = filteredOrders.filter((o) => o.status === LabOrderStatus.IN_PROGRESS);
  const completedOrders = filteredOrders.filter((o) => o.status === LabOrderStatus.COMPLETED);

  // Handle order submission
  const handleOrderSubmit = (data: Omit<LaboratoryOrder, 'id' | 'ordered_at' | 'ordered_by' | 'status' | 'sample_collected_at' | 'results_available_at' | 'results'>) => {
    const newOrder: LaboratoryOrder = {
      ...data,
      id: `order-${Date.now()}`,
      status: LabOrderStatus.ORDERED,
      ordered_by: 'current-user-id',
      ordered_at: new Date(),
    };

    setLabOrders([newOrder, ...labOrders]);
    setShowOrderDialog(false);
    
    toast({
      title: 'Test Ordered',
      description: `${newOrder.test_name} has been ordered successfully.`,
    });
  };

  // Handle sample collection
  const handleCollectSample = (order: LaboratoryOrder) => {
    setLabOrders(
      labOrders.map((o) =>
        o.id === order.id
          ? { ...o, status: LabOrderStatus.SAMPLE_COLLECTED, sample_collected_at: new Date() }
          : o
      )
    );
    setShowCollectionDialog(false);
    setSelectedOrder(null);
    
    toast({
      title: 'Sample Collected',
      description: 'Sample has been collected and sent to lab.',
    });
  };

  // Handle start processing
  const handleStartProcessing = (order: LaboratoryOrder) => {
    setLabOrders(
      labOrders.map((o) =>
        o.id === order.id ? { ...o, status: LabOrderStatus.IN_PROGRESS } : o
      )
    );
    
    toast({
      title: 'Processing Started',
      description: 'Test processing has been started.',
    });
  };

  // Handle results entry
  const handleEnterResults = (order: LaboratoryOrder) => {
    setSelectedOrder(order);
    setResultsText(order.results || '');
    setShowResultsDialog(true);
  };

  // Handle results submission
  const handleSubmitResults = () => {
    if (!selectedOrder) return;

    setLabOrders(
      labOrders.map((o) =>
        o.id === selectedOrder.id
          ? {
              ...o,
              status: LabOrderStatus.COMPLETED,
              results: resultsText,
              results_available_at: new Date(),
            }
          : o
      )
    );
    setShowResultsDialog(false);
    setSelectedOrder(null);
    setResultsText('');
    
    toast({
      title: 'Results Submitted',
      description: 'Test results have been recorded successfully.',
    });
  };

  // Handle cancel order
  const handleCancelOrder = (order: LaboratoryOrder) => {
    setLabOrders(
      labOrders.map((o) =>
        o.id === order.id ? { ...o, status: LabOrderStatus.CANCELLED } : o
      )
    );
    
    toast({
      title: 'Order Cancelled',
      description: 'Laboratory order has been cancelled.',
      variant: 'destructive',
    });
  };

  // Get status badge
  const getStatusBadge = (status: LabOrderStatus) => {
    const config = {
      [LabOrderStatus.ORDERED]: { label: 'Ordered', variant: 'secondary' as const, icon: Clock },
      [LabOrderStatus.SAMPLE_COLLECTED]: { label: 'Sample Collected', variant: 'default' as const, icon: Beaker },
      [LabOrderStatus.IN_PROGRESS]: { label: 'In Progress', variant: 'default' as const, icon: FlaskConical },
      [LabOrderStatus.COMPLETED]: { label: 'Completed', variant: 'default' as const, icon: CheckCircle2 },
      [LabOrderStatus.CANCELLED]: { label: 'Cancelled', variant: 'destructive' as const, icon: XCircle },
    };

    const { label, variant, icon: Icon } = config[status];
    return (
      <Badge variant={variant} className="flex items-center gap-1 w-fit">
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    );
  };

  // Get priority badge
  const getPriorityBadge = (priority: 'routine' | 'urgent' | 'stat') => {
    const config = {
      routine: { label: 'Routine', className: 'bg-success/10 text-success border-success/20' },
      urgent: { label: 'Urgent', className: 'bg-warning/10 text-warning border-warning/20' },
      stat: { label: 'STAT', className: 'bg-destructive/10 text-destructive border-destructive/20' },
    };

    const { label, className } = config[priority];
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  // Render order table
  const renderOrderTable = (orders: LaboratoryOrder[], showActions: boolean = true) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Patient</TableHead>
          <TableHead>Test Type</TableHead>
          <TableHead>Test Name</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Ordered</TableHead>
          {showActions && <TableHead>Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.length === 0 ? (
          <TableRow>
            <TableCell colSpan={showActions ? 7 : 6} className="text-center text-muted-foreground">
              No orders found
            </TableCell>
          </TableRow>
        ) : (
          orders.map((order) => {
            const patient = getPatient(order.patient_id);
            if (!patient) return null;

            return (
              <TableRow key={order.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {patient.first_name} {patient.last_name}
                    </div>
                    <div className="text-sm text-muted-foreground">{patient.patient_id}</div>
                  </div>
                </TableCell>
                <TableCell>{order.test_type}</TableCell>
                <TableCell>{order.test_name}</TableCell>
                <TableCell>{getPriorityBadge(order.priority)}</TableCell>
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    {new Date(order.ordered_at).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(order.ordered_at).toLocaleTimeString()}
                  </div>
                </TableCell>
                {showActions && (
                  <TableCell>
                    <div className="flex gap-2">
                      {order.status === LabOrderStatus.ORDERED && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowCollectionDialog(true);
                            }}
                          >
                            Collect Sample
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCancelOrder(order)}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                      {order.status === LabOrderStatus.SAMPLE_COLLECTED && (
                        <Button size="sm" onClick={() => handleStartProcessing(order)}>
                          Start Processing
                        </Button>
                      )}
                      {order.status === LabOrderStatus.IN_PROGRESS && (
                        <Button size="sm" onClick={() => handleEnterResults(order)}>
                          Enter Results
                        </Button>
                      )}
                      {order.status === LabOrderStatus.COMPLETED && order.results && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedOrder(order);
                            setResultsText(order.results || '');
                            setShowResultsDialog(true);
                          }}
                        >
                          View Results
                        </Button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Laboratory</h1>
          <p className="text-muted-foreground">Manage laboratory test orders and results</p>
        </div>
        <Button onClick={() => setShowOrderDialog(true)}>
          <FlaskConical className="mr-2 h-4 w-4" />
          Order Test
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting sample collection</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sample Collected</CardTitle>
            <Beaker className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{collectedOrders.length}</div>
            <p className="text-xs text-muted-foreground">Ready for processing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <FlaskConical className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressOrders.length}</div>
            <p className="text-xs text-muted-foreground">Currently processing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedOrders.length}</div>
            <p className="text-xs text-muted-foreground">Results available</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by patient name, ID, or test name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Orders Tabs */}
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="pending">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="pending">
                Pending ({pendingOrders.length})
              </TabsTrigger>
              <TabsTrigger value="collected">
                Collected ({collectedOrders.length})
              </TabsTrigger>
              <TabsTrigger value="processing">
                Processing ({inProgressOrders.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({completedOrders.length})
              </TabsTrigger>
              <TabsTrigger value="all">
                All ({filteredOrders.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="mt-4">
              {renderOrderTable(pendingOrders)}
            </TabsContent>

            <TabsContent value="collected" className="mt-4">
              {renderOrderTable(collectedOrders)}
            </TabsContent>

            <TabsContent value="processing" className="mt-4">
              {renderOrderTable(inProgressOrders)}
            </TabsContent>

            <TabsContent value="completed" className="mt-4">
              {renderOrderTable(completedOrders)}
            </TabsContent>

            <TabsContent value="all" className="mt-4">
              {renderOrderTable(filteredOrders)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Order Test Dialog */}
      <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Laboratory Test</DialogTitle>
            <DialogDescription>
              Select a patient and order a laboratory test
            </DialogDescription>
          </DialogHeader>
          {mockPatients.length > 0 && mockFlows.length > 0 && (
            <LabOrderForm
              patient={mockPatients[0]}
              flow={mockFlows[0]}
              visitId={'visit-' + mockPatients[0].id}
              onSubmit={handleOrderSubmit}
              onCancel={() => setShowOrderDialog(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Sample Collection Dialog */}
      <Dialog open={showCollectionDialog} onOpenChange={setShowCollectionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Collect Sample</DialogTitle>
            <DialogDescription>
              Confirm sample collection for this test order
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Patient</Label>
                <div className="text-sm">
                  {(() => {
                    const patient = getPatient(selectedOrder.patient_id);
                    return patient ? `${patient.first_name} ${patient.last_name} (${patient.patient_id})` : 'Unknown';
                  })()}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Test</Label>
                <div className="text-sm">{selectedOrder.test_name}</div>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <div>{getPriorityBadge(selectedOrder.priority)}</div>
              </div>
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setShowCollectionDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => handleCollectSample(selectedOrder)}>
                  Confirm Collection
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Results Entry Dialog */}
      <Dialog open={showResultsDialog} onOpenChange={setShowResultsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedOrder?.status === LabOrderStatus.COMPLETED ? 'View Results' : 'Enter Results'}
            </DialogTitle>
            <DialogDescription>
              {selectedOrder?.status === LabOrderStatus.COMPLETED
                ? 'Test results'
                : 'Enter the laboratory test results'}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Patient</Label>
                  <div className="text-sm">
                    {(() => {
                      const patient = getPatient(selectedOrder.patient_id);
                      return patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown';
                    })()}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Test</Label>
                  <div className="text-sm">{selectedOrder.test_name}</div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="results">Results</Label>
                <Textarea
                  id="results"
                  value={resultsText}
                  onChange={(e) => setResultsText(e.target.value)}
                  placeholder="Enter test results..."
                  rows={8}
                  disabled={selectedOrder.status === LabOrderStatus.COMPLETED}
                />
              </div>
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setShowResultsDialog(false)}>
                  {selectedOrder.status === LabOrderStatus.COMPLETED ? 'Close' : 'Cancel'}
                </Button>
                {selectedOrder.status !== LabOrderStatus.COMPLETED && (
                  <Button onClick={handleSubmitResults} disabled={!resultsText.trim()}>
                    Submit Results
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
