import { Module } from '@nestjs/common';
import { AuthenticationModule } from '../../libs/authentication/authentication.module';
import { UserController } from './user.controller';

@Module({
  imports: [AuthenticationModule],
  exports: [],
  controllers: [UserController],
  providers: [],
})
export class UserModule {}
