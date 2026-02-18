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
  _id: string;
  subject: Subject;
  unit: Unit;
  fileUrl: string;
  fileType: "image" | "pdf";
  createdAt: string;
  fileName: string;
}

// Mock data for frontend demo
export const MOCK_NOTES: Note[] = [
  {
    _id: "1",
    subject: "Data Communication",
    unit: 1,
    fileUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400",
    fileType: "image",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    fileName: "OSI_Model_Notes.jpg",
  },
  {
    _id: "2",
    subject: "DBMS",
    unit: 2,
    fileUrl: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400",
    fileType: "image",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    fileName: "ER_Diagram_Basics.png",
  },
  {
    _id: "3",
    subject: "Computer Graphics",
    unit: 1,
    fileUrl: "",
    fileType: "pdf",
    createdAt: new Date(Date.now() - 10800000).toISOString(),
    fileName: "Line_Drawing_Algorithms.pdf",
  },
  {
    _id: "4",
    subject: "DBMS",
    unit: 3,
    fileUrl: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=400",
    fileType: "image",
    createdAt: new Date(Date.now() - 14400000).toISOString(),
    fileName: "Normalization_Notes.jpg",
  },
  {
    _id: "5",
    subject: "English",
    unit: 1,
    fileUrl: "",
    fileType: "pdf",
    createdAt: new Date(Date.now() - 18000000).toISOString(),
    fileName: "Grammar_Unit1.pdf",
  },
  {
    _id: "6",
    subject: "Data Communication",
    unit: 2,
    fileUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400",
    fileType: "image",
    createdAt: new Date(Date.now() - 21600000).toISOString(),
    fileName: "TCP_IP_Stack.png",
  },
];
