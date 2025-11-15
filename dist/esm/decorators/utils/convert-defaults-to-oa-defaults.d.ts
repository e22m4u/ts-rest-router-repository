import { Flatten } from '../../types.js';
import { DataSchema } from '@e22m4u/ts-data-schema';
/**
 * Рекурсивный тип, который заменяет 'default' на 'oaDefault' в схеме.
 */
export type DataSchemaWithOaDefaults<T> = T extends DataSchema ? Flatten<Omit<T, 'default' | 'items' | 'properties'> & (T extends {
    default: infer D;
} ? {
    oaDefault: D;
} : {}) & ('items' extends keyof T ? {
    items: DataSchemaWithOaDefaults<T['items']>;
} : {}) & ('properties' extends keyof T ? {
    properties: {
        [K in keyof T['properties']]: DataSchemaWithOaDefaults<T['properties'][K]>;
    };
} : {})> : T;
/**
 * Подменяет опцию "default" на "oaDefault" в схеме данных.
 *
 * @param dataSchema
 */
export declare function convertDefaultsToOaDefaults<T extends DataSchema>(dataSchema: T): DataSchemaWithOaDefaults<T>;
