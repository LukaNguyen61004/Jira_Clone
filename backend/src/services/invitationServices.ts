import crypto from 'crypto';
import { InvitationModel } from "../models/invitationModel";
import { ProjectModel } from "../models/projectModel";
import { UserModel } from '../models/userModel';
import {  ProjectInvitation } from "../types";
import { sendInvitationEmail } from '../config/email';

export class InvitationService {
    static async sendInvitation(invitedEmail: string, invitorId: number, projectId: number): Promise<ProjectInvitation> {
        const invitor = await UserModel.findById(invitorId);
        const project = await ProjectModel.findById(projectId);
        if (!project) {
            throw new Error('Project is not found');
        }

        if (!invitedEmail) {
            throw new Error('This email is required');
        }
        const role = await ProjectModel.getMemberRole(projectId, invitorId);
        if (role !== 'admin') {
            throw new Error('You are not admin of this project');
        }

        const user = await UserModel.findByEmail(invitedEmail);
        if (!user) {
            throw new Error("User email does not exist");
        }

        const member = await ProjectModel.getMemberRole(projectId, user.user_id);
        if (member) {
            throw new Error('User  already in project');
        }

        const existing = await InvitationModel.findPendingByEmailAndProject(invitedEmail, projectId);
        if (existing) {
            await InvitationModel.deleteById(existing.invitation_id);
        }

        const token = crypto.randomBytes(32).toString("hex");

        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        const invitation = await InvitationModel.create(projectId, invitedEmail, token, "member", invitorId, expiresAt);

        const inviteLink = `${process.env.FRONTEND_URL}/invite?token=${invitation.token}`;

        const sendingEmail = await sendInvitationEmail(invitedEmail, project.project_name, invitor?.user_name ?? 'Someone', inviteLink);

        return invitation;
    }


    static async acceptInvitation(token: string, userId: number): Promise<void> {


        if (!token) {
            throw new Error('Token is required');
        }

        const inivation = await InvitationModel.findByToken(token);
        if (!inivation) {
            throw new Error('Invalid invitation');
        }

        if (new Date(inivation.expires_at) < new Date()) {
            throw new Error("Invitation has expried");
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        if (user.user_email !== inivation.email) {
            throw new Error("This inivation does not belong to you");
        }

        if (inivation.accepted_at) {
            throw new Error('Invitation already used');
        }

        const member = await ProjectModel.getMemberRole(inivation.project_id, user.user_id);

        if (member) {
            throw new Error('You are already member');
        }

        await ProjectModel.addMember(inivation.project_id, userId, inivation.role_member);
        await InvitationModel.accept(inivation.invitation_id);

    }
}