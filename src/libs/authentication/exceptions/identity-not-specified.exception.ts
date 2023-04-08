import { BadRequestException } from '@nestjs/common';

export class IdentityNotSpecifiedException extends BadRequestException {
  public static readonly message = 'Identity api key not specified';

  public constructor() {
    super(IdentityNotSpecifiedException.message);
  }
}
