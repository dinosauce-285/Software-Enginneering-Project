// import { Module } from '@nestjs/common';
// import { MailService } from './mail.service';

// @Module({
//   providers: [MailService],
//   exports: [MailService], // Export để các module khác có thể dùng
// })
// export class MailModule {}
// src/mail/mail.module.ts
// File: src/mail/mail.module.ts

// File: src/mail/mail.module.ts

// File: src/mail/mail.module.ts

import { Module } from '@nestjs/common';
import { MailService } from './mail.service';

@Module({
  providers: [MailService], // Cung cấp MailService
  exports: [MailService],   // "Xuất khẩu" MailService để module khác có thể import và dùng
})
export class MailModule { }