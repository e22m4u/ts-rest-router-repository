import {DataType} from '@e22m4u/js-data-schema';
import {DataSchema} from '@e22m4u/js-data-schema';

/**
 * Where clause schema.
 */
export const WHERE_CLAUSE_SCHEMA: DataSchema = {
  type: DataType.OBJECT,
  default: () => ({}),
};
