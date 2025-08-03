

// import { Injectable, InternalServerErrorException } from '@nestjs/common';
// import * as sgMail from '@sendgrid/mail';

// @Injectable()
// export class MailService {

//   constructor() {
//     // Lấy API Key từ biến môi trường và thiết lập cho thư viện SendGrid
//     const apiKey = process.env.SENDGRID_API_KEY;

//     if (!apiKey) {
//       console.warn("SENDGRID_API_KEY is not set. Email service will be disabled.");
//       // Ném lỗi để server không khởi động nếu thiếu cấu hình quan trọng
//       throw new InternalServerErrorException('SendGrid API Key is not configured.');
//     }

//     sgMail.setApiKey(apiKey);
//   }

//   /**
//    * Gửi email chứa mã OTP để đặt lại mật khẩu.
//    * Đây là một hành động quan trọng, nếu thất bại sẽ ném ra lỗi.
//    * @param userEmail - Email của người nhận.
//    * @param otp - Mã OTP 6 số.
//    */
//   async sendPasswordResetOtp(userEmail: string, otp: string) {
//     // Lấy email người gửi từ biến môi trường
//     const fromEmail = process.env.SENDGRID_FROM_EMAIL;
//     if (!fromEmail) {
//       console.error("SENDGRID_FROM_EMAIL is not set in .env file.");
//       throw new InternalServerErrorException('Sender email is not configured.');
//     }

//     // Tạo nội dung email
//     const msg = {
//       to: userEmail,
//       from: {
//         email: fromEmail,
//         name: 'SoulNote App' // Tên người gửi sẽ hiển thị trong hòm thư
//       },
//       subject: 'Your SoulNote Password Reset OTP',
//       html: `
//         <div style="font-family: Arial, sans-serif; line-height: 1.6; text-align: center; color: #333;">
//           <h2>SoulNote Password Reset Request</h2>
//           <p>We received a request to reset your password. Use the One-Time Password (OTP) below to proceed.</p>
//           <div style="margin: 20px 0;">
//             <span style="font-size: 28px; font-weight: bold; letter-spacing: 8px; padding: 12px 20px; background-color: #f1f1f1; border-radius: 8px;">
//               ${otp}
//             </span>
//           </div>
//           <p>This OTP is valid for <strong>10 minutes</strong>.</p>
//           <p>If you did not request this, please ignore this email.</p>
//           <hr style="border: 0; border-top: 1px solid #eee;" />
//           <p style="font-size: 12px; color: #777;">SoulNote App</p>
//         </div>
//       `,
//     };

//     // Gửi email và xử lý lỗi
//     try {
//       await sgMail.send(msg);
//       console.log(`Password reset OTP sent to ${userEmail}`);
//     } catch (error) {
//       console.error('Error sending password reset OTP with SendGrid:', error);
//       if (error.response) {
//         console.error(error.response.body);
//       }
//       throw new InternalServerErrorException('Failed to send email.');
//     }
//   }

//   /**
//    * Gửi email thông báo bảo mật khi mật khẩu đã được thay đổi.
//    * Đây là một hành động phụ, nếu thất bại sẽ không ném lỗi ra ngoài.
//    * @param userEmail - Email của người nhận.
//    * @param displayName - Tên hiển thị của người dùng.
//    */
//   async sendPasswordChangeNotification(userEmail: string, displayName: string) {
//     const fromEmail = process.env.SENDGRID_FROM_EMAIL;
//     if (!fromEmail) {
//       console.error("SENDGRID_FROM_EMAIL is not set in .env file. Cannot send password change notification.");
//       return; // Thoát sớm, không làm ảnh hưởng đến luồng chính
//     }

//     const msg = {
//       to: userEmail,
//       from: {
//         email: fromEmail,
//         name: 'SoulNote App'
//       },
//       subject: 'Security Alert: Your SoulNote Password Has Been Changed',
//       html: `
//         <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
//           <h2>Security Alert</h2>
//           <p>Hi ${displayName},</p>
//           <p>This is a confirmation that the password for your SoulNote account (<strong>${userEmail}</strong>) was just changed.</p>
//           <p>If you made this change, you can safely ignore this email.</p>
//           <p>If you did not make this change, please secure your account immediately by resetting your password or contacting our support team.</p>
//           <hr style="border: 0; border-top: 1px solid #eee;" />
//           <p style="font-size: 12px; color: #777;">SoulNote App</p>
//         </div>
//       `,
//     };

//     try {
//       await sgMail.send(msg);
//       console.log(`Password change notification sent to ${userEmail}`);
//     } catch (error) {
//       // Chỉ ghi lại lỗi mà không ném ra ngoài
//       console.error('Error sending password change notification with SendGrid:', error);
//       if (error.response) {
//         console.error(error.response.body);
//       }
//     }
//   }

// }

// src/mail/mail.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class MailService {
  constructor() {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      console.warn('SENDGRID_API_KEY is not set. Email service will be disabled.');
      throw new InternalServerErrorException('SendGrid API Key is not configured.');
    }
    sgMail.setApiKey(apiKey);
  }

  /**
   * Gửi email chứa mã OTP để đặt lại mật khẩu.
   * @param userEmail - Email của người nhận.
   * @param otp - Mã OTP 6 số.
   */
  async sendPasswordResetOtp(userEmail: string, otp: string): Promise<void> {
    const fromEmail = process.env.SENDGRID_FROM_EMAIL;
    if (!fromEmail) {
      console.error('SENDGRID_FROM_EMAIL is not set in .env file.');
      throw new InternalServerErrorException('Sender email is not configured.');
    }

    const msg = {
      to: userEmail,
      from: {
        email: fromEmail,
        name: 'SoulNote App',
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

    try {
      await sgMail.send(msg);
      console.log(`Password reset OTP sent to ${userEmail}`);
    } catch (error) {
      console.error('Error sending password reset OTP with SendGrid:', error);
      if (error.response) {
        console.error(error.response.body);
      }
      throw new InternalServerErrorException('Failed to send email.');
    }
  }

  /**
   * Gửi email thông báo bảo mật khi mật khẩu đã được thay đổi.
   * @param userEmail - Email của người nhận.
   * @param displayName - Tên hiển thị của người dùng.
   */
  async sendPasswordChangeNotification(userEmail: string, displayName: string): Promise<void> {
    const fromEmail = process.env.SENDGRID_FROM_EMAIL;
    if (!fromEmail) {
      console.error('SENDGRID_FROM_EMAIL is not set in .env file. Cannot send password change notification.');
      return;
    }

    const msg = {
      to: userEmail,
      from: {
        email: fromEmail,
        name: 'SoulNote App',
      },
      subject: 'Security Alert: Your SoulNote Password Has Been Changed',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2>Security Alert</h2>
          <p>Hi ${displayName},</p>
          <p>This is a confirmation that the password for your SoulNote account (<strong>${userEmail}</strong>) was just changed.</p>
          <p>If you made this change, you can safely ignore this email.</p>
          <p>If you did not make this change, please secure your account immediately by resetting your password or contacting our support team.</p>
          <hr style="border: 0; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #777;">SoulNote App</p>
        </div>
      `,
    };

    try {
      await sgMail.send(msg);
      console.log(`Password change notification sent to ${userEmail}`);
    } catch (error) {
      console.error('Error sending password change notification with SendGrid:', error);
      if (error.response) {
        console.error(error.response.body);
      }
      // Không ném lỗi ra ngoài để không ảnh hưởng luồng chính
    }
  }

  /**
   * Gửi email chào mừng/thông báo khi địa chỉ email đã được thay đổi thành công.
   * @param newEmail - Địa chỉ email mới.
   * @param displayName - Tên hiển thị của người dùng.
   */
  async sendEmailChangeConfirmation(newEmail: string, displayName: string): Promise<void> {
    const fromEmail = process.env.SENDGRID_FROM_EMAIL;
    if (!fromEmail) {
      console.error('SENDGRID_FROM_EMAIL is not set. Cannot send email change confirmation.');
      return;
    }

    const msg = {
      to: newEmail,
      from: {
        email: fromEmail,
        name: 'SoulNote App',
      },
      subject: 'Your SoulNote Email Address Has Been Updated',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2>Email Address Updated</h2>
          <p>Hi ${displayName},</p>
          <p>This email confirms that your SoulNote account's primary email address has been successfully changed to <strong>${newEmail}</strong>.</p>
          <p>You will now need to use this new email address to log in.</p>
          <p>If you did not make this change, please contact our support team immediately.</p>
          <hr style="border: 0; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #777;">SoulNote App</p>
        </div>
      `,
    };

    try {
      await sgMail.send(msg);
      console.log(`Email change confirmation sent to ${newEmail}`);
    } catch (error) {
      console.error('Error sending email change confirmation with SendGrid:', error);
      if (error.response) {
        console.error(error.response.body);
      }
      // Không ném lỗi ra ngoài
    }
  }
}
