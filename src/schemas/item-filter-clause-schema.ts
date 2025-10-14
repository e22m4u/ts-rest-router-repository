import {DataType} from '@e22m4u/js-data-schema';
import {DataSchema} from '@e22m4u/js-data-schema';

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
