import {DataType, DataSchema} from '@e22m4u/ts-data-schema';

/**
 * Item filter clause schema.
 */
export const ITEM_FILTER_CLAUSE_SCHEMA: DataSchema = {
  type: DataType.OBJECT,
  properties: {
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
