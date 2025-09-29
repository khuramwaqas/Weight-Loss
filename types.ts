
export interface WeightEntry {
  id: string;
  date: string; // Stored in "YYYY-MM-DD" format
  weight: number; // Stored in KG
  notes?: string;
}

export type Unit = 'kg' | 'lbs';

export type HeightUnit = 'cm' | 'ft';