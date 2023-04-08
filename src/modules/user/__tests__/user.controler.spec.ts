import { HttpStatus } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { CreateUserInput } from '../dto/create-user.dto';
import { UpdateUserInput } from '../dto/update-user.dto';
import { UserDto } from '../dto/user.dto';
import { REPOSITORY_USER_TOKEN } from '../user.constants';
import { UserController } from '../user.controller';
import { UserEntity } from '../user.entity';
import { MockUserRepository } from './mock-user.repository';

describe('Test cases for user api', () => {
  let app: NestFastifyApplication;
  let userRepository: MockUserRepository;

  const userEntity: UserEntity = {
    id: 1,
    name: 'first',
    lastName: 'first',
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: REPOSITORY_USER_TOKEN,
          useValue: new MockUserRepository(),
        },
      ],
    }).compile();

    userRepository = moduleRef.get(REPOSITORY_USER_TOKEN);

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    await app.init();
    await (
      app.getHttpAdapter().getInstance() as { ready: () => Promise<void> }
    ).ready();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => {
    userRepository.clearTestResults();
  });

  describe('Get users', () => {
    it('should successfully return users', async () => {
      userRepository.addUser({ ...userEntity, id: 1 });
      userRepository.addUser({ ...userEntity, id: 2 });
      userRepository.addUser({ ...userEntity, id: 3 });

      const response = await app.inject({
        method: 'GET',
        url: '/users',
      });
      const usersDto: UserDto[] = response.json();

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(usersDto.length).toEqual(3);
      expect(usersDto[0]).toMatchObject(userEntity);
    });
  });

  describe('Get user by id', () => {
    it('should successfully return user', async () => {
      userRepository.addUser(userEntity);

      const response = await app.inject({
        method: 'GET',
        url: '/users/1',
      });
      const userDto: UserDto = response.json();

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(userDto).toMatchObject(userEntity);
    });

    it('should not found user', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/users/100',
      });

      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(response.json().message).toEqual(`cannot find user by id: 100`);
    });
  });

  describe('Create user', () => {
    it('should successfully create user', async () => {
      const payload: CreateUserInput = {
        lastName: 'ro',
        name: 'ro',
      };

      const response = await app.inject({
        method: 'POST',
        payload,
        url: '/users',
      });
      const userDto: UserDto = response.json();

      expect(response.statusCode).toBe(HttpStatus.CREATED);
      expect(userDto).toMatchObject(payload);
    });
  });

  describe('Update user', () => {
    it('should successfully update user', async () => {
      userRepository.addUser(userEntity);

      const payload: UpdateUserInput = {
        lastName: 'ro',
        name: 'ro',
      };

      const response = await app.inject({
        method: 'PUT',
        payload,
        url: '/users/1',
      });
      const userDto: UserDto = response.json();

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(userDto).toMatchObject(payload);
    });
  });

  describe('Delete user', () => {
    it('should successfully delete user', async () => {
      userRepository.addUser(userEntity);

      const response = await app.inject({
        method: 'DELETE',
        url: '/users/1',
      });

      expect(response.statusCode).toBe(HttpStatus.OK);
    });

    it('should not found user', async () => {
      const response = await app.inject({
        method: 'DELETE',
        url: '/users/500',
      });

      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(response.json().message).toEqual(`cannot find user by id: 500`);
    });
  });
});
