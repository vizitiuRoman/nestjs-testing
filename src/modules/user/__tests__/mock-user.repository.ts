import { CreateUserInput } from '../dto/create-user.dto';
import { IUserRepository } from '../interfaces/user.repository';
import { UserEntity } from '../user.entity';

export class MockUserRepository implements IUserRepository<UserEntity> {
  private count = 1;

  public users: UserEntity[] = [];

  public clearTestResults(): void {
    this.users = [];
  }

  public addUser(entity: UserEntity): void {
    this.users.push(entity);
  }

  public createEntity(input: CreateUserInput): UserEntity {
    const entity = new UserEntity();
    Object.assign(entity, input);

    entity.id = this.count;

    this.count = this.count + 1;

    return entity;
  }

  public async deleteById(id: number): Promise<void> {
    this.users = this.users.filter((user) => user.id !== id);
  }

  public async findAll(): Promise<UserEntity[]> {
    return this.users;
  }

  public async findOneById(id: number): Promise<UserEntity | null> {
    const user = this.users.find((user) => user.id === id);
    if (user === undefined) {
      return null;
    }

    return user;
  }

  public async save(entity: UserEntity): Promise<UserEntity> {
    this.users.push(entity);

    return entity;
  }
}
