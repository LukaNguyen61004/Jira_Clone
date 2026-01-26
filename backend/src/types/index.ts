

//User
export interface User {
  user_id: number;
  user_email: string;
  user_password_hash: string;
  user_name: string;
  user_avatar_url: string | null;
  user_created_at: Date;
}

export interface UserResponse {
  user_id: number;
  user_email: string;
  user_name: string;
  user_avatar_url: string | null;
  user_created_at: Date;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginResquest {
  email: string;
  password: string;
}

export interface JWTPayload {
  userId: number;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

// Project

export interface Project {
  project_id: number;
  project_name: string;
  project_key: string;
  project_description: string | null;
  created_by: number;
  project_created_at: Date;
}

export interface ProjectMember {
  pm_id: number;
  project_id: number;
  user_id: number;
  role: 'admin' | 'member';
  joined_at: Date;
}

export interface ProjectCreator extends Project {
  creator_name: string;
  creator_email: string;
}

export interface ProjectMemberWithUser {
  user_id: number;
  user_name: string;
  user_email: string;
  user_avatar_url: string | null;
  role: 'admin' | 'member';
  joined_at: Date;
}

export interface ProjectWithDetails {
  project_id: number;
  project_name: string;
  project_key: string;
  project_description: string | null;
  created_by: number;
  project_created_at: Date;
  creator_name: string;
  creator_email: string;
  your_role: 'admin' | 'member';
}


export interface CreatedProjectRequest {
  name: string;
  key: string;
  description?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
}

export interface AddMemberRequest {
  userId: number;
  role: "admin" | "member";
}

//Issue
export interface Issue {
  issue_id: number;
  project_id: number;
  issue_key: string;
  issue_name: string;
  issue_description: string | null;
  issue_type: 'task' | 'bug' | 'story';
  issue_status: 'todo' | 'in_process' | 'done';
  issue_priority: 'low' | 'medium' | 'high';
  reporter_id: number;
  assignee_id: number | null;
  issue_created_at: Date;
  issue_updated_at: Date;
}

export interface IssueWithDetails {
  issue_id: number;
  project_id: number;
  issue_key: string;
  issue_name: string;
  issue_description: string | null;
  issue_type: 'task' | 'bug' | 'story';
  issue_status: 'todo' | 'in_process' | 'done';
  issue_priority: 'low' | 'medium' | 'high';
  reporter_id: number;
  reporter_name: string;
  reporter_email: string;
  assignee_id: number | null;
  assignee_name: string | null;
  assignee_email: string | null;
  issue_created_at: Date;
  issue_updated_at: Date;
}

export interface CreateIssueRequest {
  name: string;
  description?: string;
  type: 'task' | 'bug' | 'story';
  priority?: 'low' | 'medium' | 'high';
  assigneeId?: number;
}

export interface UpdateIssueRequest {
  name: string;
  description?: string;
  type?: 'task' | 'bug' | 'story';
  priority?: 'low' | 'medium' | 'high';
  status?: 'todo' | 'in_process' | 'done';
  assigneeId?: number | null; //null = unassign
}

//Comment

export interface Comment {
  comment_id: number;
  user_id: number;
  issue_id: number;
  comment_content: string;
  comment_created_at: Date;
  comment_updated_at: Date;
}

export interface CommentWithUser {
  comment_id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  user_avatar_url: string | null;
  issue_id: number;
  comment_content: string;
  comment_created_at: Date;
  comment_updated_at: Date;
}

export interface CreateCommentRequest{
  content:string;
}

export interface UpdateCommentRequest{
  content:string;
}