import { DataType } from '@e22m4u/js-data-schema';
/**
 * Count result schema.
 */
export const COUNT_RESULT_SCHEMA = {
    type: DataType.OBJECT,
    properties: {
        count: {
            type: DataType.NUMBER,
        },
    },
};
