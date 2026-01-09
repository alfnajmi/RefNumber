// Staff information interface
export interface Staff {
  id: string;
  name: string;
  department: string;
}

// Registration record interface
export interface Registration {
  id?: string;
  number: string;
  type: 'Surat' | 'Memo';
  fileSecurityCode?: string; // T, S, TD, R, RB
  staffId: string;
  name: string;
  department: string;
  referenceNumber?: string;
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

// Department code mapping (for reference number generation)
export const DEPARTMENT_CODES: Record<string, string> = {
  "Geospatial and Data management Division": "1",
  "Geospatial Network Data Management and Coordination Department": "2",
  "Geospatial Performance and Compliance Department": "3",
  "Geospatial Application Services and Analytics Department": "4",
  "National Address Management Department": "5",
  "Digital Innovation and Solutions Department": "6",
};

// File Security Code options
export const FILE_SECURITY_CODES = [
  { code: "T", label: "T - Terbuka (Open)" },
  { code: "S", label: "S - Sulit (Confidential)" },
  { code: "TD", label: "TD - Terhad (Restricted)" },
  { code: "R", label: "R - Rahsia (Secret)" },
  { code: "RB", label: "RB - Rahsia Besar (Top Secret)" },
] as const;
