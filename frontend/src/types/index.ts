export interface Project {
  project_id: number;
  project_name: string;
  project_key: string;
  project_description: string | null;
  your_role: 'admin' | 'member';
  created_by: number;
  project_created_at: Date;
}