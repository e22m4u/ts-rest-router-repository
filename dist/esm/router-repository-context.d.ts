import { Service } from '@e22m4u/js-service';
import { ServiceContainer } from '@e22m4u/js-service';
import { RepositoryDataSchema } from '@e22m4u/js-repository-data-schema';
/**
 * Router repository context.
 */
export declare class RouterRepositoryContext extends Service {
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
    constructor(container?: ServiceContainer);
    /**
     * Set global instance.
     *
     * @param inst
     */
    static setGlobalInstance(inst: RouterRepositoryContext): void;
    /**
     * Has global instance.
     */
    static hasGlobalInstance(): boolean;
    /**
     * Get global instance.
     */
    static getGlobalInstance(): RouterRepositoryContext;
    /**
     * Remove global instance.
     */
    static removeGlobalInstance(): void;
    /**
     * Возвращает существующий экземпляр сервиса RepositoryDataSchema,
     * или создает новый (требует сервис схемы базы данных).
     */
    getRepositoryDataSchemaService(): RepositoryDataSchema;
}
