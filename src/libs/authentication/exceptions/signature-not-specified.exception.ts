import { BadRequestException } from '@nestjs/common';

export class SignatureNotSpecifiedException extends BadRequestException {
  public static readonly message = 'Signature not specified';

  public constructor() {
    super(SignatureNotSpecifiedException.message);
  }
}
