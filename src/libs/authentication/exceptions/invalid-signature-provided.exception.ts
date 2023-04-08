import { UnauthorizedException } from '@nestjs/common';

export class InvalidSignatureProvidedException extends UnauthorizedException {
  public static readonly message = 'Invalid signature provided';

  public constructor() {
    super(InvalidSignatureProvidedException.message);
  }
}
