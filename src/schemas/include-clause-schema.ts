import {DataType} from '@e22m4u/js-data-schema';
import {DataSchema} from '@e22m4u/js-data-schema';

/**
 * Include clause schema.
 */
export const INCLUDE_CLAUSE_SCHEMA: DataSchema = {
  type: DataType.ANY,
  default: () => [],
};
