import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';

@Injectable()
export class FirebaseService implements OnModuleInit {
  onModuleInit() {
    // Chỉ khởi tạo nếu chưa có instance nào được tạo
    if (admin.apps.length === 0) {
      const serviceAccountPath = path.join(
        process.cwd(),
        'firebase-service-account.json',
      );

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccountPath),
      });
      console.log('Firebase Admin SDK Initialized.');
    }
  }

  /**
   * Xác thực ID Token từ client và trả về thông tin user đã được giải mã.
   * @param idToken ID Token do Firebase SDK phía client cung cấp.
   * @returns {Promise<admin.auth.DecodedIdToken>}
   */
  async verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      return decodedToken;
    } catch (error) {
      // Ném lỗi để tầng service gọi nó có thể bắt và xử lý
      throw new Error('Invalid or expired Firebase token.');
    }
  }
}