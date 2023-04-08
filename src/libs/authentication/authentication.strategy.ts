import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { FastifyRequest } from 'fastify';
import { Strategy } from 'passport-custom';
import { AuthenticationStrategies } from './authentication-strategies.enum';
import { IdentityDto } from './dto/identity.dto';
import { IdentityNotSpecifiedException } from './exceptions/identity-not-specified.exception';
import { InvalidSignatureProvidedException } from './exceptions/invalid-signature-provided.exception';
import { SignatureNotSpecifiedException } from './exceptions/signature-not-specified.exception';

@Injectable()
export class SignatureStrategy extends PassportStrategy(
  Strategy,
  AuthenticationStrategies.MOCK_SIGN,
) {
  public constructor() {
    super();
  }

  public async validate(req: FastifyRequest): Promise<IdentityDto> {
    const signature = req.headers['x-signature'] as string;
    const identityId = req.headers['x-user-api-key'] as string;

    if (!signature) {
      throw new SignatureNotSpecifiedException();
    }

    if (!identityId) {
      throw new IdentityNotSpecifiedException();
    }

    if (signature !== 'mock') {
      throw new InvalidSignatureProvidedException();
    }

    return new IdentityDto(identityId);
  }
}
