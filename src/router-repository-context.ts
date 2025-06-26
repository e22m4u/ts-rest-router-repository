import {Errorf} from '@e22m4u/js-format';
import {Service} from '@e22m4u/js-service';
import {ServiceContainer} from '@e22m4u/js-service';
import {DatabaseSchema} from '@e22m4u/js-repository';
import {RepositoryDataSchema} from '@e22m4u/js-repository-data-schema';

/**
 * Router repository context.
 */
export class RouterRepositoryContext extends Service {
  /**
   * Глобальный экземпляр текущего сервиса.
   * (используется декораторами)
   */
  protected static globalInstance: RouterRepositoryContext | undefined;

  /**
   * Constructor.
   *
   * @param container
   */
  constructor(container?: ServiceContainer) {
    super(container);
    if (!RouterRepositoryContext.globalInstance)
      RouterRepositoryContext.setGlobalInstance(this);
  }

  /**
   * Set global instance.
   *
   * @param inst
   */
  static setGlobalInstance(inst: RouterRepositoryContext) {
    this.globalInstance = inst;
  }

  /**
   * Has global instance.
   */
  static hasGlobalInstance() {
    return this.globalInstance != null;
  }

  /**
   * Get global instance.
   */
  static getGlobalInstance() {
    if (this.globalInstance) return this.globalInstance;
    throw new Errorf(
      'The RouterRepositoryContext class has no registered global instance.',
    );
  }

  /**
   * Remove global instance.
   */
  static removeGlobalInstance() {
    RouterRepositoryContext.globalInstance = undefined;
  }

  /**
   * Возвращает существующий экземпляр сервиса RepositoryDataSchema,
   * или создает новый (требует сервис схемы базы данных).
   */
  getRepositoryDataSchemaService() {
    const hasRds = this.hasService(RepositoryDataSchema);
    if (!hasRds) {
      const hasDbs = this.hasService(DatabaseSchema);
      if (!hasDbs)
        throw new Errorf(
          'A DatabaseSchema instance must be registered ' +
            'in the RouterRepositoryContext service.',
        );
      const rds = new RepositoryDataSchema();
      const dbs = this.getService(DatabaseSchema);
      rds.setService(DatabaseSchema, dbs);
      this.setService(RepositoryDataSchema, rds);
    }
    return this.getService(RepositoryDataSchema);
  }
}
