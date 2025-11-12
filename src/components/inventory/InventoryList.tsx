import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import type { InventoryItem } from '@/types/models';
import { InventoryCategory } from '@/types/enums';
import { format } from 'date-fns';

interface InventoryListProps {
  items: InventoryItem[];
  isLoading?: boolean;
  onItemSelect?: (item: InventoryItem) => void;
  onEdit?: (item: InventoryItem) => void;
  onDelete?: (item: InventoryItem) => void;
  onRecordTransaction?: (item: InventoryItem) => void;
}

const ITEMS_PER_PAGE = 20;

export function InventoryList({
  items,
  isLoading = false,
  onItemSelect,
  onEdit,
  onDelete,
  onRecordTransaction,
}: InventoryListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Filter and search items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        searchQuery === '' ||
        item.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.item_code.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        categoryFilter === 'all' || item.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [items, searchQuery, categoryFilter]);

  // Group items by category
  const itemsByCategory = useMemo(() => {
    const grouped: Record<string, InventoryItem[]> = {};
    filteredItems.forEach((item) => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });
    return grouped;
  }, [filteredItems]);

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const isLowStock = (item: InventoryItem) => {
    return item.quantity <= item.reorder_threshold;
  };

  const getCategoryLabel = (category: InventoryCategory) => {
    return category.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const getCategoryColor = (category: InventoryCategory) => {
    switch (category) {
      case InventoryCategory.MEDICAL_SUPPLIES:
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case InventoryCategory.EQUIPMENT:
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case InventoryCategory.PHARMACEUTICALS:
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case InventoryCategory.CONSUMABLES:
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by item name or code..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9"
          />
        </div>
        <Select
          value={categoryFilter}
          onValueChange={(value) => {
            setCategoryFilter(value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {Object.values(InventoryCategory).map((category) => (
              <SelectItem key={category} value={category}>
                {getCategoryLabel(category)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Category Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(itemsByCategory).map(([category, categoryItems]) => {
          const lowStockCount = categoryItems.filter(isLowStock).length;
          return (
            <div
              key={category}
              className="rounded-lg border border-border bg-card p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <Badge className={getCategoryColor(category as InventoryCategory)}>
                  {getCategoryLabel(category as InventoryCategory)}
                </Badge>
                {lowStockCount > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {lowStockCount} Low
                  </Badge>
                )}
              </div>
              <p className="text-2xl font-bold">{categoryItems.length}</p>
              <p className="text-xs text-muted-foreground">Items</p>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-lg font-medium text-foreground">No items found</p>
          <p className="text-sm text-muted-foreground mt-1">
            Try adjusting your search criteria or add a new item
          </p>
        </div>
      ) : (
        <>
          {/* Inventory Table */}
          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Code</TableHead>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Reorder Level</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.map((item) => {
                  const lowStock = isLowStock(item);
                  return (
                    <TableRow
                      key={item.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => onItemSelect?.(item)}
                    >
                      <TableCell className="font-medium">{item.item_code}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {lowStock && (
                            <ExclamationTriangleIcon className="h-4 w-4 text-destructive" />
                          )}
                          {item.item_name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getCategoryColor(item.category)}>
                          {getCategoryLabel(item.category)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            lowStock
                              ? 'font-semibold text-destructive'
                              : 'font-medium'
                          }
                        >
                          {item.quantity}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {item.unit_of_measure}
                      </TableCell>
                      <TableCell className="text-sm">{item.reorder_threshold}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {item.location || '-'}
                      </TableCell>
                      <TableCell className="text-sm">
                        {item.expiry_date ? (
                          <span
                            className={
                              new Date(item.expiry_date) <
                              new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                                ? 'text-destructive font-medium'
                                : 'text-muted-foreground'
                            }
                          >
                            {format(new Date(item.expiry_date), 'MMM dd, yyyy')}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {onRecordTransaction && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onRecordTransaction(item);
                              }}
                            >
                              Transaction
                            </Button>
                          )}
                          {onEdit && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onEdit(item);
                              }}
                            >
                              Edit
                            </Button>
                          )}
                          {onDelete && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(item);
                              }}
                              className="text-destructive hover:text-destructive"
                            >
                              Delete
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredItems.length)} of{' '}
              {filteredItems.length} items
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                <ChevronLeftIcon className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRightIcon className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
