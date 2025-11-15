import { DataSchema } from '@e22m4u/ts-data-schema';
/**
 * Data schema with `oaDefault` option.
 */
export type DataSchemaWithOaDefault = DataSchema & {
    items?: DataSchemaWithOaDefault;
    properties?: {
        [key: string]: DataSchemaWithOaDefault | undefined;
    };
    oaDefault?: DataSchema['default'];
};
/**
 * Подменяет опцию "default" на "oaDefault" в схеме данных.
 *
 * @param dataSchema
 */
export declare function convertDsDefaultToOaDefault(dataSchema: DataSchema): DataSchemaWithOaDefault;
