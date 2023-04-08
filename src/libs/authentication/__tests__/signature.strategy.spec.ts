import { HttpException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { FastifyRequest } from 'fastify';
import { SignatureStrategy } from '../authentication.strategy';
import { IdentityDto } from '../dto/identity.dto';
import { IdentityNotSpecifiedException } from '../exceptions/identity-not-specified.exception';
import { InvalidSignatureProvidedException } from '../exceptions/invalid-signature-provided.exception';
import { SignatureNotSpecifiedException } from '../exceptions/signature-not-specified.exception';

describe('SignatureStrategy', () => {
  let signatureStrategy: SignatureStrategy;

  const identityDto: IdentityDto = new IdentityDto('mock');

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      providers: [SignatureStrategy],
    }).compile();

    signatureStrategy = moduleRef.get<SignatureStrategy>(SignatureStrategy);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be valid signature and user api key', async () => {
    const req = {
      body: { name: 'qwe' },
      headers: {
        'x-user-api-key': identityDto.id,
        'x-signature': 'mock',
      },
      method: 'POST',
      url: '/',
    } as unknown as FastifyRequest;

    expect(
      await signatureStrategy.validate(req as FastifyRequest),
    ).toStrictEqual(identityDto);
  });

  it('should be invalid signature provided', async () => {
    const req = {
      body: { name: 'qwe' },
      headers: {
        'x-user-api-key': identityDto.id,
        'x-signature': 'invalid',
      },
      method: 'POST',
      url: '/',
    } as unknown as FastifyRequest;

    await expect(
      signatureStrategy.validate(req as FastifyRequest),
    ).rejects.toThrowError(new InvalidSignatureProvidedException());
  });

  it.each([
    {
      body: { name: 'qwe' },
      headers: {
        'x-signature': 'mock',
      },
      error: new IdentityNotSpecifiedException(),
      name: 'bad request exception: user api key not specified',
    },
    {
      body: { name: 'qwe' },
      headers: {
        'x-user-api-key': identityDto.id,
      },
      error: new SignatureNotSpecifiedException(),
      name: 'bad request exception: signature not specified',
    },
  ] as Array<{
    error: HttpException;
    name: string;
    headers: Record<string, unknown>;
    body: Record<string, unknown>;
  }>)('should return $name', async ({ headers, body, error }) => {
    const req = {
      body,
      headers,
    };

    await expect(
      signatureStrategy.validate(req as FastifyRequest),
    ).rejects.toThrowError(error);
  });
});
