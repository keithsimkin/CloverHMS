import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { HospitalCharge } from '@/types/models';
import { PencilIcon, PlusIcon } from 'lucide-react';
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

interface HospitalChargesConfigProps {
  charges: HospitalCharge[];
  onAddCharge: (charge: Partial<HospitalCharge>) => void;
  onUpdateCharge: (id: string, charge: Partial<HospitalCharge>) => void;
}

const serviceCategories = [
  'Consultation',
  'Laboratory',
  'Radiology',
  'Pharmacy',
  'Surgery',
  'Emergency',
  'Bed Charges',
  'Other',
];

export function HospitalChargesConfig({
  charges,
  onAddCharge,
  onUpdateCharge,
}: HospitalChargesConfigProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [editingCharge, setEditingCharge] = useState<HospitalCharge | null>(null);
  const [formData, setFormData] = useState({
    service_name: '',
    service_category: '',
    charge_amount: '',
    department: '',
  });

  const filteredCharges = charges.filter(
    (charge) =>
      charge.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      charge.service_category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openDialog = (charge?: HospitalCharge) => {
    if (charge) {
      setEditingCharge(charge);
      setFormData({
        service_name: charge.service_name,
        service_category: charge.service_category,
        charge_amount: charge.charge_amount.toString(),
        department: charge.department || '',
      });
    } else {
      setEditingCharge(null);
      setFormData({
        service_name: '',
        service_category: '',
        charge_amount: '',
        department: '',
      });
    }
    setShowDialog(true);
  };

  const handleSubmit = () => {
    const chargeData = {
      service_name: formData.service_name,
      service_category: formData.service_category,
      charge_amount: parseFloat(formData.charge_amount),
      department: formData.department || undefined,
      effective_from: new Date(),
    };

    if (editingCharge) {
      onUpdateCharge(editingCharge.id, chargeData);
    } else {
      onAddCharge(chargeData);
    }

    setShowDialog(false);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Hospital Charges Configuration</CardTitle>
            <Button onClick={() => openDialog()}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Charge
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search by service name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Charge Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCharges.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No charges configured
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCharges.map((charge) => (
                    <TableRow key={charge.id}>
                      <TableCell className="font-medium">{charge.service_name}</TableCell>
                      <TableCell>{charge.service_category}</TableCell>
                      <TableCell>{charge.department || 'N/A'}</TableCell>
                      <TableCell>${charge.charge_amount.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDialog(charge)}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCharge ? 'Edit Charge' : 'Add New Charge'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Service Name</Label>
              <Input
                value={formData.service_name}
                onChange={(e) =>
                  setFormData({ ...formData, service_name: e.target.value })
                }
                placeholder="e.g., General Consultation"
              />
            </div>

            <div>
              <Label>Category</Label>
              <Select
                value={formData.service_category}
                onValueChange={(value) =>
                  setFormData({ ...formData, service_category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {serviceCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Department (Optional)</Label>
              <Input
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
                placeholder="e.g., Cardiology"
              />
            </div>

            <div>
              <Label>Charge Amount</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.charge_amount}
                onChange={(e) =>
                  setFormData({ ...formData, charge_amount: e.target.value })
                }
                placeholder="0.00"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {editingCharge ? 'Update' : 'Add'} Charge
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
