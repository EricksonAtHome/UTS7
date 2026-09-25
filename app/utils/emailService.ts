import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'Enter-your-Google-API-user-mail',
    pass: 'Enter-your-Google-API-password'
  }
});

export async function sendEmail(content: string): Promise<void> {
  await transporter.sendMail({
    from: 'Enter-your-Google-API-mail',
    to: 'Enter-your-Google-mail',
    subject: 'New User Visit - UTS7',
    text: content
  });
}