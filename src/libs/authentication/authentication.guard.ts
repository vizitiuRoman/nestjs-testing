import { AuthGuard as NestAuthGuard } from '@nestjs/passport';

export class AuthenticationGuard extends NestAuthGuard() {
}
