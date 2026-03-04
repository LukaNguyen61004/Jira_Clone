import nodemailer from 'nodemailer';

const transporter= nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});


export const sendInvitationEmail= async(
    to:string, 
    projectName:string,
    inviterName: string,
    inviteLink: string
): Promise<void> =>{
     await transporter.sendMail({
        from: `"Jira Clone" <${process.env.EMAIL_USER}>`,
        to,
        subject: `You've been invited to join ${projectName}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>You've been invited!</h2>
                <p><strong>${inviterName}</strong> invited you to join project <strong>${projectName}</strong>.</p>
                <p>Click the button below to accept the invitation:</p>
                <a href="${inviteLink}" 
                   style="background-color: #0052CC; color: white; padding: 12px 24px; 
                          text-decoration: none; border-radius: 4px; display: inline-block;">
                    Accept Invitation
                </a>
                <p style="color: #666; margin-top: 24px;">
                    This invitation will expire in 7 days. If you did not expect this invitation, you can ignore this email.
                </p>
            </div>
        `
    });
}