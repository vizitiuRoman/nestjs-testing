import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { GenericRepository } from '../../shared/repository/generic.repository';
import { CreateUserInput } from './dto/create-user.dto';
import { IUserRepository } from './interfaces/user.repository';
import { UserEntity } from './user.entity';

@Injectable()
export class UserRepository
  extends GenericRepository<UserEntity>
  implements IUserRepository<UserEntity>
{
  public constructor(public readonly dataSource: DataSource) {
    super(UserEntity, dataSource);
  }

  public createEntity(input: CreateUserInput): UserEntity {
    return super.create(input);
  }

  public findAll(): Promise<UserEntity[]> {
    return super.find();
  }

  public async deleteById(id: number): Promise<void> {
    await super.delete(id);
  }
}
