import {DataSchema} from '@e22m4u/ts-data-schema';

/**
 * Data schema with `oaDefault` option.
 */
export type DataSchemaWithOaDefault = DataSchema & {
  items?: DataSchemaWithOaDefault;
  properties?: {[key: string]: DataSchemaWithOaDefault | undefined};
  oaDefault?: DataSchema['default'];
};

/**
 * Подменяет опцию "default" на "oaDefault" в схеме данных.
 *
 * @param dataSchema
 */
export function convertDsDefaultToOaDefault(
  dataSchema: DataSchema,
): DataSchemaWithOaDefault {
  const res = {...dataSchema} as DataSchemaWithOaDefault;
  if (res.default) {
    res.oaDefault = res.default;
    delete res.default;
  }
  if (res.items) {
    res.items = convertDsDefaultToOaDefault(res.items);
  }
  if (res.properties) {
    for (const propName in res.properties) {
      const propValue = res.properties[propName];
      if (propValue) {
        res.properties[propName] = convertDsDefaultToOaDefault(propValue);
      }
    }
  }
  return res;
}
