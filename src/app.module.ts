import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [SharedModule, UserModule],
})
export class AppModule {}
