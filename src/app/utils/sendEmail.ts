import nodemailer from 'nodemailer';
import { config } from '../config/index.js';

export const SendEmail = async (to: string, resetUrl: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.NODE_ENV === 'production',
    auth: {
      user: 'mdarmanahmed1232@gmail.com',
      pass: 'zuju jcde binb bbwv',
    },
  });

  await transporter.sendMail({
    from: 'mdarmanahmed1232@gmail.com',
    to,
    subject: 'Reset your password within ten mins',
    text: `Click the following link to reset your password: ${resetUrl}`,
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
  });
};
