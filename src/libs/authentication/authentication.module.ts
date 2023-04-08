import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthenticationStrategies } from './authentication-strategies.enum';
import { SignatureStrategy } from './authentication.strategy';

@Module({
  controllers: [],
  exports: [PassportModule],
  imports: [
    PassportModule.register({
      defaultStrategy: AuthenticationStrategies.MOCK_SIGN,
    }),
  ],
  providers: [SignatureStrategy],
})
export class AuthenticationModule {}
