import {DataType, DataSchema} from '@e22m4u/ts-data-schema';

/**
 * Where clause schema.
 */
export const WHERE_CLAUSE_SCHEMA: DataSchema = {
  type: DataType.OBJECT,
  default: () => ({}),
};
