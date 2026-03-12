
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
  issue_status: 'todo' | 'in_process'| 'in_review' | 'done';
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
  issue_status: 'todo' | 'in_process' | 'in_review' | 'done';
  issue_priority: 'low' | 'medium' | 'high';
  reporter_id: number;
  reporter_name: string;
  reporter_email: string;
  assignee_id: number | null;
  assignee_name: string | null;
  assignee_email: string | null;
  epic_id: number | null;           
  epic_name: string | null;         
  epic_color: string | null;        
  sprint_id: number | null;         
  sprint_name: string | null;       
  sprint_status: string | null; 
  issue_created_at: Date;
  issue_updated_at: Date;
}

export interface CreateIssueRequest {
  name: string;
  description?: string;
  type: 'task' | 'bug' | 'story';
  priority?: 'low' | 'medium' | 'high';
  assigneeId?: number;
  epicId?: number;      
  sprintId?: number
}

export interface UpdateIssueRequest {
  name: string;
  description?: string;
  type?: 'task' | 'bug' | 'story';
  priority?: 'low' | 'medium' | 'high';
  status?: 'todo' | 'in_process' | 'in_review' | 'done';
  assigneeId?: number | null; 
  epicId?: number | null;    
  sprintId?: number | null;
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

// Epic

export interface Epic{
  epic_id:number;
  project_id:number;
  epic_name:string;
  epic_description: string | null;
  epic_color: string;
  created_by:number;
  epic_created_at:Date;
  epic_updated_at:Date;
}


export interface EpicWithDetails{
  epic_id:number;
  project_id:number;
  epic_name: string;
  epic_description: string | null;
  epic_color:string;
  created_by: number;
  creatorn_name:string;
  epic_created_at:Date;
  epic_updated_at: Date;
  issue_count: number;
}

export interface CreateEpicRequest{
  name:string;
  description?: string;
  color?: string;
}

export interface UpdateEpicRequest{
  name?:string;
  description?:string;
  color?: string;
}

// Sprint
export interface Sprint{
  sprint_id:number;
  project_id: number;
  sprint_name: string;
  sprint_goal: string | null;
  sprint_status: 'planned' | 'active' | 'completed';
  start_date: Date | null;
  end_date: Date | null;
  created_by: number;
  sprint_created_at: Date;
  sprint_updated_at:Date;
}

export interface SprintWithDetails{
  sprint_id:number;
  project_id:number;
  sprint_name: string;
  sprint_goal:string | null;
  sprint_status: 'planned' | 'active' | 'completed';
  start_date:Date | null;
  end_date: Date | null;
  created_by: number;
  creator_name: string;
  sprint_created_at:Date;
  sprint_updated_at: Date;
  issue_count: number; 
  completed_count: number; 
}

export interface CreateSprintRequest {
  name: string;
  goal?: string;
  startDate?: string; 
  endDate?: string;
}

export interface UpdateSprintRequest {
  name?: string;
  goal?: string;
  status?: 'planned' | 'active' | 'completed';
  startDate?: string | null;
  endDate?: string | null;
}

//Notification
export type NotificationType= 'issue_assigned' | 'issue_updated' | 'comment_added' | 'sprint_started' | 'sprint_completed' | 'member_added';

export interface Notification{
  notifi_id:number;
  user_id:number;
  notifi_type:NotificationType;
  notifi_titile: string;
  notifi_content:string;
  is_read:boolean;
  related_issue_id:number | null;
  related_project_id: number |null;
  related_sprint_id: number | null;
  notifi_created_at: Date;
}

export interface NotificationWithMeta extends Notification{
  issue_key: string | null;
  project_name:string | null;
  sprint_name: string | null;
}


//invitation
export interface ProjectInvitation {
  invitation_id: number;
  project_id: number;
  email: string;
  token: string;
  role_member: 'admin' | 'member';
  invited_by: number;
  expires_at: Date;
  accepted_at: Date | null;
  created_at: Date;
}

export interface CreateInvitationRequest {
  email: string;
  role?: 'admin' | 'member'; 
}