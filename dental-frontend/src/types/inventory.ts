export interface InventoryItemDTO {
  id: number;
  code?: string;
  name: string;
  unit: string;
  manufacturer?: string;
  categoryName: string;
  requiresExpiry: boolean;
  isActive: boolean;
  reorderPoint: number;
  standardCostPrice: number;
  currentStock: number;
}

export interface StockLevelDTO {
  itemId: number;
  itemCode: string;
  itemName: string;
  unit: string;
  quantity: number;
  reorderPoint: number;
  isLowStock: boolean;
}

export interface LowStockAlertDTO {
  itemId: number;
  itemCode: string;
  itemName: string;
  unit: string;
  currentQuantity: number;
  reorderPoint: number;
  deficit: number;
}

export interface ExpiringBatchDTO {
  batchId: number;
  itemName: string;
  batchNumber: string;
  expiryDate: string;
  remainingQuantity: number;
  unit: string;
  daysUntilExpiry: number;
}
