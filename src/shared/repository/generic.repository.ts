import { DataSource, Repository } from 'typeorm';
import { EntityTarget } from 'typeorm/common/EntityTarget';

export class GenericRepository<T> extends Repository<T> {
  public constructor(
    public readonly target: EntityTarget<T>,
    public readonly dataSource: DataSource,
  ) {
    super(target, dataSource.createEntityManager());
  }
}
