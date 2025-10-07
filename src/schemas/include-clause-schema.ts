import {DataType} from '@e22m4u/ts-data-schema';
import {DataSchema} from '@e22m4u/ts-data-schema';

/**
 * Include clause schema.
 */
export const INCLUDE_CLAUSE_SCHEMA: DataSchema = {
  type: DataType.ANY,
  default: () => [],
};
