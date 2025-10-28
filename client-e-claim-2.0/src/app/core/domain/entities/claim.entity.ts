export interface Claim {
  id: string;
  number: string;
  received_date: string;
  name: string;
  registration_number: string;
  phone: string;
  ageing: number;
  status_name: 'New' | 'Draft' | 'In Progress' | 'Completed' | 'Queries';
  isTotalLoss?: boolean;
  // vehicleDetails?: VehicleDetails;
  // repairEstimates?: RepairEstimate[];
  // documents?: Document[];
}


export interface VehicleDetails {
  make: string;
  model: string;
  fuelType: string;
  transmission: string;
  chassisNumber: string;
  color: string;
  cc: number;
  engineNumber: string;
  odometerReading: number;
  pointOfImpact: string;
  condition: 'as-new' | 'excellent' | 'fair' | 'good' | 'poor';
  placeOfSurvey: string;
}

export interface RepairEstimate {
  partName: string;
  suppliers: PartSupplier[];
  laborDetails: LaborDetail[];
}

export interface PartSupplier {
  name: string;
  price: number;
  isPreferred: boolean;
  isLowestCost: boolean;
}

export interface LaborDetail {
  description: string;
  hours: number;
  rate: number;
  total: number;
}

export interface Document {
  id: string;
  name: string;
  type: 'image' | 'pdf';
  url: string;
  uploadedAt: Date;
}

export interface CardItem {
  id: string;
  name: string;
  count: number;
}