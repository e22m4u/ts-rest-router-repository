import { DataSchema } from '@e22m4u/ts-data-schema';
/**
 * Data schema with open api options.
 */
export type DataSchemaWithOaOptions = DataSchema & {
    items?: DataSchemaWithOaOptions;
    properties?: {
        [key: string]: DataSchemaWithOaOptions | undefined;
    };
    oaDefault?: DataSchema['default'];
};
/**
 * Подменяет опцию "default" на "oaDefault" в схеме данных.
 *
 * @param dataSchema
 */
export declare function convertDsDefaultToOaDefault(dataSchema: DataSchema): DataSchemaWithOaOptions;
