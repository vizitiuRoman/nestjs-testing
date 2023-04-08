import { isArray } from 'class-validator';
import { UserEntity } from '../user.entity';

type Options = {
  id: number;
  name: string;
  lastName: string;
};

export class UserDto {
  public id: number;

  public name: string;

  public lastName: string;

  public constructor(private readonly opts: Options) {
    this.id = opts.id;
    this.name = opts.name;
    this.lastName = opts.lastName;
  }

  public static asEntities(opts: UserEntity[]): UserDto[] {
    return opts.map(
      ({ id, name, lastName }) => new UserDto({ id, lastName, name }),
    );
  }

  public static asEntity({ id, name, lastName }: UserEntity): UserDto {
    return new UserDto({ id, name, lastName });
  }
}
