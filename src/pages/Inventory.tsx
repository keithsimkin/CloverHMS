import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { InventoryList } from '@/components/inventory/InventoryList';
import { InventoryItemForm } from '@/components/inventory/InventoryItemForm';
import { InventoryTransaction } from '@/components/inventory/InventoryTransaction';
import { PlusIcon } from '@heroicons/react/24/outline';
import { generateMockInventoryItems, generateMockInventoryTransaction } from '@/lib/mockData';
import type { InventoryItem, InventoryTransaction as InventoryTransactionType } from '@/types/models';
import { InventoryCategory, TransactionType } from '@/types/enums';

export default function Inventory() {
  const { toast } = useToast();
  const [items, setItems] = useState<InventoryItem[]>(() => generateMockInventoryItems(50));
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock transaction history for selected item
  const getTransactionHistory = (itemId: string): InventoryTransactionType[] => {
    return Array.from({ length: 5 }, () => generateMockInventoryTransaction(itemId));
  };

  const handleCreateItem = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newItem: InventoryItem = {
        id: `item-${Date.now()}`,
        item_code: data.item_code,
        item_name: data.item_name,
        category: data.category as InventoryCategory,
        quantity: Number(data.quantity),
        unit_of_measure: data.unit_of_measure,
        reorder_threshold: Number(data.reorder_threshold),
        unit_cost: data.unit_cost ? Number(data.unit_cost) : undefined,
        supplier: data.supplier || undefined,
        location: data.location || undefined,
        expiry_date: data.expiry_date ? new Date(data.expiry_date) : undefined,
        created_at: new Date(),
        updated_at: new Date(),
      };

      setItems((prev) => [newItem, ...prev]);
      setIsCreateDialogOpen(false);

      toast({
        title: 'Item created',
        description: `${newItem.item_name} has been added to inventory.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create item. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateItem = async (data: any) => {
    if (!selectedItem) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const updatedItem: InventoryItem = {
        ...selectedItem,
        item_code: data.item_code,
        item_name: data.item_name,
        category: data.category as InventoryCategory,
        quantity: Number(data.quantity),
        unit_of_measure: data.unit_of_measure,
        reorder_threshold: Number(data.reorder_threshold),
        unit_cost: data.unit_cost ? Number(data.unit_cost) : undefined,
        supplier: data.supplier || undefined,
        location: data.location || undefined,
        expiry_date: data.expiry_date ? new Date(data.expiry_date) : undefined,
        updated_at: new Date(),
      };

      setItems((prev) =>
        prev.map((item) => (item.id === selectedItem.id ? updatedItem : item))
      );
      setIsEditDialogOpen(false);
      setSelectedItem(null);

      toast({
        title: 'Item updated',
        description: `${updatedItem.item_name} has been updated successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update item. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = async (item: InventoryItem) => {
    if (!confirm(`Are you sure you want to delete ${item.item_name}?`)) {
      return;
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setItems((prev) => prev.filter((i) => i.id !== item.id));

      toast({
        title: 'Item deleted',
        description: `${item.item_name} has been removed from inventory.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete item. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleRecordTransaction = async (data: any) => {
    if (!selectedItem) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const transactionType = data.transaction_type as TransactionType;
      const quantityChange = Number(data.quantity_change);

      // Calculate new quantity based on transaction type
      let newQuantity = selectedItem.quantity;

      if (transactionType === TransactionType.ADDITION) {
        newQuantity += quantityChange;
      } else if (
        transactionType === TransactionType.USAGE ||
        transactionType === TransactionType.DISPOSAL
      ) {
        newQuantity = Math.max(0, newQuantity - quantityChange);
      } else if (transactionType === TransactionType.ADJUSTMENT) {
        newQuantity += quantityChange;
      }

      // Update item quantity
      const updatedItem: InventoryItem = {
        ...selectedItem,
        quantity: newQuantity,
        updated_at: new Date(),
      };

      setItems((prev) =>
        prev.map((item) => (item.id === selectedItem.id ? updatedItem : item))
      );

      // Update selected item for the dialog
      setSelectedItem(updatedItem);

      toast({
        title: 'Transaction recorded',
        description: `${selectedItem.item_name} quantity updated to ${newQuantity}.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to record transaction. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsEditDialogOpen(true);
  };

  const handleTransactionClick = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsTransactionDialogOpen(true);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground mt-1">
            Track medical supplies, equipment, and pharmaceuticals
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Inventory List */}
      <InventoryList
        items={items}
        onEdit={handleEditClick}
        onDelete={handleDeleteItem}
        onRecordTransaction={handleTransactionClick}
      />

      {/* Create Item Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Inventory Item</DialogTitle>
            <DialogDescription>
              Enter the item information below. Fields marked with * are required.
            </DialogDescription>
          </DialogHeader>
          <InventoryItemForm
            onSubmit={handleCreateItem}
            onCancel={() => setIsCreateDialogOpen(false)}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Inventory Item</DialogTitle>
            <DialogDescription>
              Update the item information below. Fields marked with * are required.
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <InventoryItemForm
              item={selectedItem}
              onSubmit={handleUpdateItem}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setSelectedItem(null);
              }}
              isSubmitting={isSubmitting}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Record Transaction Dialog */}
      <Dialog open={isTransactionDialogOpen} onOpenChange={setIsTransactionDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Record Inventory Transaction</DialogTitle>
            <DialogDescription>
              Record additions, usage, adjustments, or disposals for this item.
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <InventoryTransaction
              item={selectedItem}
              transactions={getTransactionHistory(selectedItem.id)}
              onSubmit={handleRecordTransaction}
              onCancel={() => {
                setIsTransactionDialogOpen(false);
                setSelectedItem(null);
              }}
              isSubmitting={isSubmitting}
            />
          )}
        </DialogContent>
      </Dialog>
      </div>
    </MainLayout>
  );
}
