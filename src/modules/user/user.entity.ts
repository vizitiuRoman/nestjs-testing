import { Column, Entity } from 'typeorm';

@Entity()
export class UserEntity {
  @Column()
  public id: number;

  @Column()
  public name: string;

  @Column()
  public lastName: string;
}
