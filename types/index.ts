// Staff information interface
export interface Staff {
  id: string;
  name: string;
  department: string;
}

// Registration record interface
export interface Registration {
  number: string;
  type: 'Surat' | 'Memo';
  staffId: string;
  name: string;
  department: string;
  registeredAt: string;
}

// Departments enum
export const DEPARTMENTS = [
  "Geospatial and Data management Division",
  "Geospatial Network Data Management and Coordination Department",
  "Geospatial Performance and Compliance Department",
  "Geospatial Application Services and Analytics Department",
  "National Address Management Department",
  "Digital Innovation and Solutions Department",
] as const;

export type Department = typeof DEPARTMENTS[number];
