import {Flatten} from '../../types.js';
import {DataSchema} from '@e22m4u/ts-data-schema';

/**
 * Рекурсивный тип, который заменяет 'default' на 'oaDefault' в схеме.
 */
export type DataSchemaWithOaDefaults<T> = T extends DataSchema
  ? Flatten<
      // берутся все свойства, кроме тех, что трансформируются
      Omit<T, 'default' | 'items' | 'properties'> &
        // добавляется 'oaDefault', если 'default' существовал
        // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        (T extends {default: infer D} ? {oaDefault: D} : {}) &
        // рекурсивно обрабатывается 'items', если присутствует
        ('items' extends keyof T
          ? {items: DataSchemaWithOaDefaults<T['items']>}
          : // eslint-disable-next-line @typescript-eslint/no-empty-object-type
            {}) &
        // рекурсивно обрабатывается каждое свойство в 'properties'
        ('properties' extends keyof T
          ? {
              properties: {
                [K in keyof T['properties']]: DataSchemaWithOaDefaults<
                  T['properties'][K]
                >;
              };
            }
          : // eslint-disable-next-line @typescript-eslint/no-empty-object-type
            {})
    >
  : T; // если T не DataSchema, то возвращается как есть

/**
 * Подменяет опцию "default" на "oaDefault" в схеме данных.
 *
 * @param dataSchema
 */
export function convertDefaultsToOaDefaults<T extends DataSchema>(
  dataSchema: T,
): DataSchemaWithOaDefaults<T> {
  const res = {...dataSchema} as T & {oaDefault: T['default']};
  if (res.default) {
    res.oaDefault = res.default;
    delete res.default;
  }
  if (res.items) {
    res.items = convertDefaultsToOaDefaults(res.items);
  }
  if (res.properties) {
    for (const propName in res.properties) {
      const propValue = res.properties[propName];
      if (propValue) {
        res.properties[propName] = convertDefaultsToOaDefaults(propValue);
      }
    }
  }
  return res as unknown as DataSchemaWithOaDefaults<T>;
}
