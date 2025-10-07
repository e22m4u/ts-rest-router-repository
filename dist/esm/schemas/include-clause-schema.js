import { DataType } from '@e22m4u/ts-data-schema';
/**
 * Include clause schema.
 */
export const INCLUDE_CLAUSE_SCHEMA = {
    type: DataType.ANY,
    default: () => [],
};
