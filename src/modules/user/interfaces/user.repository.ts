import { CreateUserInput } from '../dto/create-user.dto';
import { UserEntity } from '../user.entity';

export interface IUserRepository<T extends UserEntity> {
  createEntity(input: CreateUserInput): UserEntity;

  save(entity: T): Promise<T>;

  findAll(): Promise<T[]>;

  findOneById(id: number): Promise<T | null>;

  deleteById(id: number): Promise<void>;
}
