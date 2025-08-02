import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class MailService {

  constructor() {
    // Lấy API Key từ biến môi trường và thiết lập cho thư viện SendGrid
    const apiKey = process.env.SENDGRID_API_KEY;

    if (!apiKey) {
      console.warn("SENDGRID_API_KEY is not set. Email service will be disabled.");
      // Ném lỗi để server không khởi động nếu thiếu cấu hình quan trọng
      throw new InternalServerErrorException('SendGrid API Key is not configured.');
    }
    
    sgMail.setApiKey(apiKey);
  }

  async sendPasswordResetOtp(userEmail: string, otp: string) {
    // Lấy email người gửi từ biến môi trường
    const fromEmail = process.env.SENDGRID_FROM_EMAIL;
    if (!fromEmail) {
        console.error("SENDGRID_FROM_EMAIL is not set in .env file.");
        throw new InternalServerErrorException('Sender email is not configured.');
    }

    // Tạo nội dung email
    const msg = {
      to: userEmail,
      from: {
        email: fromEmail,
        name: 'SoulNote App' // Tên người gửi sẽ hiển thị trong hòm thư
      },
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
          <p>If you did not request this, please ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #777;">SoulNote App</p>
        </div>
      `,
    };

    // Gửi email và xử lý lỗi
    try {
      await sgMail.send(msg);
      console.log(`Password reset OTP sent to ${userEmail}`);
    } catch (error) {
      console.error('Error sending email with SendGrid:', error);
      
      // Ghi log lỗi chi tiết hơn nếu có
      if (error.response) {
        console.error(error.response.body);
      }
      
      throw new InternalServerErrorException('Failed to send email.');
    }
  }
}