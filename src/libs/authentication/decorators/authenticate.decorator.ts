import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthenticationGuard } from '../authentication.guard';

// eslint-disable-next-line @typescript-eslint/naming-convention
export function Authenticate(): MethodDecorator {
  return applyDecorators(UseGuards(AuthenticationGuard));
}
