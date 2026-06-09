export type UserRole = "alumno" | "profesor";

export interface UserProfile {
  name: string;
  email: string;
  role: UserRole;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  submitted: boolean;
  score: number | null; // out of 100
}

export interface ClassItem {
  id: string;
  name: string;
  subject: string;
  code: string;
  teacherName: string;
  studentCount: number;
  tasks: Task[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}
