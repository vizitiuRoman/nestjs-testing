import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.dto';
import { UpdateUserInput } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { IUserRepository } from './interfaces/user.repository';
import { REPOSITORY_USER_TOKEN } from './user.constants';
import { UserEntity } from './user.entity';

@Controller('users')
export class UserController {
  public constructor(
    @Inject(REPOSITORY_USER_TOKEN)
    private readonly userRepository: IUserRepository<UserEntity>,
  ) {}

  @Get('')
  public async getAll(): Promise<UserDto[]> {
    const users = await this.userRepository.findAll();

    return UserDto.asEntities(users);
  }

  @Get(':id')
  public async getById(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<UserDto> {
    const user = await this.userRepository.findOneById(id);
    if (user === null) {
      throw new NotFoundException(`cannot find user by id: ${id}`);
    }

    return UserDto.asEntity(user);
  }

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  public async create(@Body() input: CreateUserInput): Promise<UserDto> {
    const entity = this.userRepository.createEntity({
      name: input.name,
      lastName: input.lastName,
    });
    const user = await this.userRepository.save(entity);

    return UserDto.asEntity(user);
  }

  @Put(':id')
  public async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() input: UpdateUserInput,
  ): Promise<UserDto> {
    const user = await this.userRepository.findOneById(id);
    if (user === null) {
      throw new NotFoundException(`cannot find user by id: ${id}`);
    }

    const entity = this.userRepository.createEntity({
      ...user,
      ...input,
    });

    const updated = await this.userRepository.save(entity);

    return UserDto.asEntity(updated);
  }

  @Delete(':id')
  public async delete(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<void> {
    const user = await this.userRepository.findOneById(id);
    if (user === null) {
      throw new NotFoundException(`cannot find user by id: ${id}`);
    }

    return this.userRepository.deleteById(id);
  }
}
