import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';

@Module({
  providers: [FirebaseService],
  exports: [FirebaseService], // <<< QUAN TRỌNG: Export service
})
export class FirebaseModule {}