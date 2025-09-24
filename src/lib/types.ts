export type Vehicle = {
  id: string;
  model: string;
  operator: string;
  status: 'Active' | 'In Maintenance' | 'Decommissioned';
  vin: string;
};

export type Equipment = {
  id: string;
  type: 'Validator' | 'Console' | 'GPS Module' | 'Router';
  assignedVehicleId: string | null;
  status: 'Operational' | 'Requires Repair' | 'In Stock';
  serialNumber: string;
};

export type MaintenanceTask = {
  id: string;
  title: string;
  vehicleId: string;
  equipmentType: Equipment['type'];
  frequency: 'Quarterly' | 'Biannually' | 'Annually';
  dueDate: Date;
  status: 'Pending' | 'In Progress' | 'Completed';
  technician?: string;
};

export type Incident = {
  id: string;
  vehicleId: string;
  issue: string;
  reportedBy: string;
  assignedTo: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  reportedAt: Date;
  slaDays: number;
};

export type InventoryItem = {
  id: string;
  name: string;
  sku: string;
  category: 'Generic' | 'Free Stock' | 'Vendor Specific';
  stock: number;
  location: string;
};
