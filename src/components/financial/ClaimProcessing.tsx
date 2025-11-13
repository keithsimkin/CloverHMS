import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { InsuranceClaim, InsuranceProvider } from '@/types/models';
import { ClaimStatus } from '@/types/enums';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { formatDistanceToNow } from 'date-fns';

interface ClaimProcessingProps {
  claims: InsuranceClaim[];
  providers: InsuranceProvider[];
  onUpdateClaim: (claimId: string, updates: Partial<InsuranceClaim>) => void;
}

export function ClaimProcessing({ claims, providers, onUpdateClaim }: ClaimProcessingProps) {
  const [selectedClaim, setSelectedClaim] = useState<InsuranceClaim | null>(null);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [status, setStatus] = useState<ClaimStatus>(ClaimStatus.PENDING);
  const [approvedAmount, setApprovedAmount] = useState('');
  const [notes, setNotes] = useState('');

  const getProviderName = (providerId: string) => {
    return providers.find((p) => p.id === providerId)?.name || 'Unknown';
  };

  const getStatusBadgeVariant = (status: ClaimStatus) => {
    switch (status) {
      case ClaimStatus.PENDING:
        return 'secondary';
      case ClaimStatus.APPROVED:
        return 'default';
      case ClaimStatus.REJECTED:
        return 'destructive';
      case ClaimStatus.PAID:
        return 'outline';
      default:
        return 'default';
    }
  };

  const openUpdateDialog = (claim: InsuranceClaim) => {
    setSelectedClaim(claim);
    setStatus(claim.status);
    setApprovedAmount(claim.approved_amount?.toString() || '');
    setNotes(claim.notes || '');
    setShowUpdateDialog(true);
  };

  const handleUpdate = () => {
    if (selectedClaim) {
      onUpdateClaim(selectedClaim.id, {
        status,
        approved_amount: approvedAmount ? parseFloat(approvedAmount) : undefined,
        notes,
      });
      setShowUpdateDialog(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setSelectedClaim(null);
    setStatus(ClaimStatus.PENDING);
    setApprovedAmount('');
    setNotes('');
  };

  const pendingClaims = claims.filter((c) => c.status === ClaimStatus.PENDING);
  const processedClaims = claims.filter((c) => c.status !== ClaimStatus.PENDING);

  const renderClaimRow = (claim: InsuranceClaim) => (
    <TableRow key={claim.id}>
      <TableCell>
        <div>
          <p className="font-medium">{claim.claim_number}</p>
          <p className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(claim.claim_date), { addSuffix: true })}
          </p>
        </div>
      </TableCell>
      <TableCell>{getProviderName(claim.provider_id)}</TableCell>
      <TableCell>${claim.claim_amount.toFixed(2)}</TableCell>
      <TableCell>
        {claim.approved_amount ? `$${claim.approved_amount.toFixed(2)}` : 'N/A'}
      </TableCell>
      <TableCell>
        <Badge variant={getStatusBadgeVariant(claim.status)}>
          {claim.status.toUpperCase()}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <Button size="sm" variant="outline" onClick={() => openUpdateDialog(claim)}>
          Update
        </Button>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Insurance Claims Processing</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending">
            <TabsList>
              <TabsTrigger value="pending">
                Pending ({pendingClaims.length})
              </TabsTrigger>
              <TabsTrigger value="processed">
                Processed ({processedClaims.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="mt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Claim Details</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Claim Amount</TableHead>
                      <TableHead>Approved Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingClaims.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                          No pending claims
                        </TableCell>
                      </TableRow>
                    ) : (
                      pendingClaims.map(renderClaimRow)
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="processed" className="mt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Claim Details</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Claim Amount</TableHead>
                      <TableHead>Approved Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {processedClaims.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                          No processed claims
                        </TableCell>
                      </TableRow>
                    ) : (
                      processedClaims.map(renderClaimRow)
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Claim Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedClaim && (
              <div className="rounded-md bg-muted p-3 text-sm">
                <p><strong>Claim:</strong> {selectedClaim.claim_number}</p>
                <p><strong>Amount:</strong> ${selectedClaim.claim_amount.toFixed(2)}</p>
              </div>
            )}

            <div>
              <Label>Status</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as ClaimStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ClaimStatus.PENDING}>Pending</SelectItem>
                  <SelectItem value={ClaimStatus.APPROVED}>Approved</SelectItem>
                  <SelectItem value={ClaimStatus.REJECTED}>Rejected</SelectItem>
                  <SelectItem value={ClaimStatus.PAID}>Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(status === ClaimStatus.APPROVED || status === ClaimStatus.PAID) && (
              <div>
                <Label>Approved Amount</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={approvedAmount}
                  onChange={(e) => setApprovedAmount(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            )}

            <div>
              <Label>Notes</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about the claim..."
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowUpdateDialog(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdate}>Update Claim</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
