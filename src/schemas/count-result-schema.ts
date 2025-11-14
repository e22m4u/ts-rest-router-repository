import {DataType, DataSchema} from '@e22m4u/ts-data-schema';

/**
 * Count result schema.
 */
export const COUNT_RESULT_SCHEMA: DataSchema = {
  type: DataType.OBJECT,
  properties: {
    count: {
      type: DataType.NUMBER,
    },
  },
};
