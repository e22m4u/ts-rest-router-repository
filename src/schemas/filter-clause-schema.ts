import {DataType, DataSchema} from '@e22m4u/ts-data-schema';

/**
 * Filter clause schema.
 */
export const FILTER_CLAUSE_SCHEMA: DataSchema = {
  type: DataType.OBJECT,
  properties: {
    where: {
      type: DataType.OBJECT,
      default: () => ({}),
    },
    order: {
      type: DataType.ANY,
      default: () => [],
    },
    limit: {
      type: DataType.NUMBER,
      default: 10,
    },
    skip: {
      type: DataType.NUMBER,
      default: 0,
    },
    fields: {
      type: DataType.ARRAY,
      items: {type: DataType.STRING},
      default: () => [],
    },
    include: {
      type: DataType.ANY,
      default: () => [],
    },
  },
};
