export type Role = "applicant" | "installer" | "inspector" | "admin" | "satba";

export type Stage =
  | "request"
  | "financing"
  | "installer_assignment"
  | "execution"
  | "testing"
  | "handover"
  | "after_sales";

export type SubStage =
  | "not_started"
  | "in_progress"
  | "waiting_review"
  | "approved"
  | "rejected"
  | "blocked";

export type UserStatus = "active" | "pending" | "suspended";

export interface User {
  id: string;
  name: string;
  role: Role;
  mobile: string;
  status: UserStatus;
  lastSeen: string;
}

export interface Applicant {
  id: string;
  userId: string;
  name: string;
  type: "حقیقی" | "حقوقی";
  nationalId: string;
  mobile: string;
  city: string;
  address: string;
}

export interface Installer {
  id: string;
  name: string;
  manager: string;
  score: number;
  capacityKw: number;
  regions: string[];
  docsStatus: "complete" | "pending" | "expired";
  completedProjects: number;
  activeProjects: number;
  phone: string;
  rejectionRate: number;
  avgHandoverDays: number;
}

export interface Project {
  id: string;
  code: string;
  applicantId: string;
  applicantName: string;
  applicantType: "حقیقی" | "حقوقی";
  installerId: string;
  installerName: string;
  stage: Stage;
  subStage: SubStage;
  capacityKw: number;
  city: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  progress: number;
  nextAction: string;
  nextActionOwner: string;
  amount: number;
  paid: number;
  flags: string[];
}

export interface Contract {
  id: string;
  projectId: string;
  amount: number;
  status: "draft" | "pending_signature" | "signed" | "cancelled";
  file: string;
  signedAt?: string;
}

export interface Payment {
  id: string;
  projectId: string;
  title: string;
  amount: number;
  dueDate: string;
  paidAt?: string;
  status: "paid" | "due" | "overdue" | "scheduled";
  stage: Stage;
}

export interface Equipment {
  id: string;
  projectId: string;
  type: string;
  brand: string;
  model: string;
  serial: string;
  qty: number;
}

export interface DocFile {
  id: string;
  projectId: string;
  type: string;
  uploader: string;
  status: "pending" | "approved" | "rejected";
  date: string;
  rejectReason?: string;
}

export interface ProgressReport {
  id: string;
  projectId: string;
  date: string;
  percent: number;
  text: string;
  images: number;
  author: string;
}

export interface TestResult {
  id: string;
  projectId: string;
  type: string;
  result: "pass" | "fail" | "pending";
  date: string;
}

export interface Ticket {
  id: string;
  projectId: string;
  type: "complaint" | "after_sales";
  status: "open" | "answered" | "closed";
  subject: string;
  createdAt: string;
  messages: { author: string; at: string; text: string }[];
}

export interface Feedback {
  projectId: string;
  score: number;
  comment: string;
  date: string;
}

export interface Notification {
  id: string;
  userId: string;
  text: string;
  read: boolean;
  date: string;
  tone: "info" | "success" | "warn" | "danger";
}

export interface TimelineEvent {
  id: string;
  projectId: string;
  at: string;
  actor: string;
  action: string;
  detail: string;
  tone: "default" | "success" | "warn" | "danger" | "info";
}
