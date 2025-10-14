import {DataType} from '@e22m4u/js-data-schema';
import {DataSchema} from '@e22m4u/js-data-schema';

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
