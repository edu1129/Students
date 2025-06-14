// --- API Related Types ---
export interface StudentLoginPayload {
  schoolCode: string;
  mobile: string;
  password?: string; // Optional as per original logic, might be required by API
}

export interface StudentProfile {
  StudentID: string;
  Name: string;
  PhotoURL?: string;
  ClassNameWithSection?: string;
  Class?: string;
  RollNumber?: string;
  FatherName?: string;
  MotherName?: string;
  Mobile?: string;
  Gmail?: string;
  Gender?: string;
  Address?: string;
  Aadhar?: string;
  RegistrationDate?: string; // Assuming date string
  [key: string]: any; // For other dynamic properties
}

export interface FeeItem {
  FeeTypeName?: string;
  FeeTypeID?: string;
  DueDate?: string; // Assuming date string
  PaidDate?: string; // Assuming date string
  Amount: number;
  Status?: string;
}

export interface FeesData {
  totalDue: number;
  totalPaid: number;
  due: FeeItem[];
  paid: FeeItem[];
  byMonthPaid: { [monthYear: string]: number }; // e.g., "January 2023": 5000
}

export interface MonthlyAttendance {
  present: number;
  absent: number;
  workingDays: number;
}

export interface AttendanceData {
  totalSchoolDaysCounted: number;
  totalPresent: number;
  totalAbsent: number;
  byMonth: { [monthYear: string]: MonthlyAttendance }; // e.g., "January 2023": {present: 20, absent: 2, workingDays: 22}
}

export interface StudentFullData {
  profile: StudentProfile;
  fees?: FeesData;
  attendance?: AttendanceData;
}

export interface StudentListItem {
  studentId: string;
  name: string;
  className: string;
}

export interface StudentLoginResponse {
  success: boolean;
  spreadsheetId?: string;
  multipleStudents?: boolean;
  studentList?: StudentListItem[];
  studentData?: StudentFullData;
  error?: string;
  message?: string;
}

export interface StudentDetailsResponse {
  success: boolean;
  data?: StudentFullData;
  error?: string;
  message?: string;
}

export type ApiAction = 'handleStudentLogin' | 'getStudentFullDetails';

export interface ApiPayload {
  action: ApiAction;
  spreadsheetId?: string;
  studentId?: string;
  schoolCode?: string;
  mobile?: string;
  password?: string;
}

// --- UI Related Types ---
export type ViewState = 'login' | 'selectStudent' | 'profile';

export interface MessageType {
  text: string;
  type: 'error' | 'success' | 'info';
}

// Global declarations for libraries loaded via CDN
declare global {
  const html2canvas: (element: HTMLElement, options?: any) => Promise<HTMLCanvasElement>;
  namespace jspdf {
    class jsPDF {
      constructor(options?: any);
      addImage(imageData: string | HTMLImageElement | HTMLCanvasElement | Uint8Array, format: string, x: number, y: number, width: number, height: number, alias?: string, compression?: string, rotation?: number): this;
      save(filename?: string): void;
      // Add other methods if used
    }
  }
  const Chart: any; // For Chart.js global
}
