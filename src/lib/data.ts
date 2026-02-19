export const SUBJECTS = [
  "Data Communication",
  "DBMS",
  "Computer Graphics",
  "Kannada",
  "English",
  "Hindi",
] as const;

export type Subject = (typeof SUBJECTS)[number];

export const UNITS = [1, 2, 3, 4] as const;
export type Unit = (typeof UNITS)[number];

export interface Note {
  _id?: string;
  id: number | string;
  subject: Subject;
  unit: Unit;
  fileUrl: string;
  fileType: "image" | "pdf";
  createdAt?: string; // MongoDB field
  fileName?: string;
  uploadDate: string;
  isApproved?: boolean;
}


