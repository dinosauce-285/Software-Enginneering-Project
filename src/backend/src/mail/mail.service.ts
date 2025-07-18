import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // 1. Kiểm tra tất cả các biến môi trường cần thiết
    const mailHost = process.env.MAIL_HOST;
    const mailUser = process.env.MAIL_USER;
    const mailPassword = process.env.MAIL_PASSWORD;
    const mailPort = process.env.MAIL_PORT;

    if (!mailHost || !mailUser || !mailPassword || !mailPort) {
      throw new InternalServerErrorException('Email server configuration is incomplete.');
    }

    // 2. Sử dụng các biến đã được kiểm tra
    this.transporter = nodemailer.createTransport({
      host: mailHost,
      port: parseInt(mailPort, 10), // Giờ mailPort chắc chắn là một chuỗi
      secure: process.env.MAIL_SECURE === 'true',
      auth: {
        user: mailUser,
        pass: mailPassword,
      },
      // Thêm cấu hình này để tránh lỗi timeout ở một số môi trường
      connectionTimeout: 10000, // 10 giây
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });
  }

  async sendPasswordResetOtp(userEmail: string, otp: string) {
    // Phần này giữ nguyên
    const mailFrom = process.env.MAIL_FROM || '"SoulNote App" <no-reply@soulnote.com>';
    
    await this.transporter.sendMail({
      from: mailFrom,
      to: userEmail,
      subject: 'Your SoulNote Password Reset OTP',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; text-align: center; color: #333;">
          <h2>SoulNote Password Reset Request</h2>
          <p>We received a request to reset your password. Use the One-Time Password (OTP) below to proceed.</p>
          <div style="margin: 20px 0;">
            <span style="font-size: 28px; font-weight: bold; letter-spacing: 8px; padding: 12px 20px; background-color: #f1f1f1; border-radius: 8px;">
              ${otp}
            </span>
          </div>
          <p>This OTP is valid for <strong>10 minutes</strong>.</p>
          <p>If you did not request this, please ignore this email or contact support if you have concerns.</p>
          <hr style="border: 0; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #777;">SoulNote App</p>
        </div>
      `,
    });
  }
}