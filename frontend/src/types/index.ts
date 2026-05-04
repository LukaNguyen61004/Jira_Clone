export interface Project {
  project_id: number;
  project_name: string;
  project_key: string;
  project_description: string | null;
  your_role: 'admin' | 'member';
  created_by: number;
  project_created_at: Date;
}

export type Issue = {
  issue_id: number;
  issue_name: string;
  issue_key: string;
  issue_priority: "low" | "medium" | "high";
  sprint_id: number | null;
};

export type Sprint = {
  sprint_id: number;
  sprint_name: string;
  sprint_status: "planned" | "active" | "completed";
};