import {Flatten} from '../types.js';
import {DecoratorModelInput} from './types.js';
import {DataType} from '@e22m4u/ts-data-schema';
import {requestBody} from '@e22m4u/ts-rest-router';
import {ProjectionScope} from '@e22m4u/ts-projection';
import {DataSchemaOptions} from '@e22m4u/js-repository-data-schema';
import {extractModelClassFromDecoratorInput} from './utils/index.js';
import {RepositoryDataSchema} from '@e22m4u/js-repository-data-schema';

/**
 * Request body with model options.
 */
export type RequestBodyWithModelDecoratorOptions = Flatten<
  DataSchemaOptions & {required?: boolean}
>;

/**
 * Декоратор-обертка для @requestBody, который позволяет передавать
 * первым аргументом модель (класс), массив с единственной моделью
 * (указывает на массив элементов), или фабрику возвращающую модель
 * или массив с моделью.
 *
 * Схема тела объекта:
 *   @requestBodyWithModel(MyModel)
 *   @requestBodyWithModel(() => MyModel)
 *
 * Схема тела массива объектов:
 *   @requestBodyWithModel([MyModel])
 *   @requestBodyWithModel(() => [MyModel])
 *
 * @param model
 */
export function requestBodyWithModel<T extends object>(
  model: DecoratorModelInput<T>,
  options?: RequestBodyWithModelDecoratorOptions,
): ReturnType<typeof requestBody> {
  return requestBody(container => {
    const {modelClass, isArray} = extractModelClassFromDecoratorInput(
      requestBodyWithModel.name,
      model,
    );
    const rds = container.get(RepositoryDataSchema);
    const dataSchema = rds.getDataSchemaByModelClass(
      modelClass,
      ProjectionScope.INPUT,
      {skipDefaultValues: true, ...options},
    );
    const res = isArray
      ? {type: DataType.ARRAY, items: dataSchema}
      : dataSchema;
    if (typeof options?.required === 'boolean') {
      res.required = options?.required;
    }
    return res;
  });
}
