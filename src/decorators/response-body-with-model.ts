import {DecoratorModelInput} from './types.js';
import {DataType} from '@e22m4u/js-data-schema';
import {responseBody} from '@e22m4u/ts-rest-router';
import {ProjectionScope} from '@e22m4u/ts-projection';
import {DataSchemaOptions} from '@e22m4u/js-repository-data-schema';
import {extractModelClassFromDecoratorInput} from './utils/index.js';
import {RepositoryDataSchema} from '@e22m4u/js-repository-data-schema';

/**
 * Декоратор-обертка для @responseBody, который позволяет передавать
 * первым аргументом модель (класс), массив с единственной моделью
 * (указывает на массив элементов), или фабрику возвращающую модель
 * или массив с моделью.
 *
 * Схема тела объекта:
 *   @responseBodyWithModel(MyModel)
 *   @responseBodyWithModel(() => MyModel)
 *
 * Схема тела массива объектов:
 *   @responseBodyWithModel([MyModel])
 *   @responseBodyWithModel(() => [MyModel])
 *
 * @param model
 */
export function responseBodyWithModel<T extends object>(
  model: DecoratorModelInput<T>,
  options?: DataSchemaOptions,
): ReturnType<typeof responseBody> {
  return responseBody(container => {
    const {modelClass, isArray} = extractModelClassFromDecoratorInput(
      responseBodyWithModel.name,
      model,
    );
    const rds = container.get(RepositoryDataSchema);
    const dataSchema = rds.getDataSchemaByModelClass(
      modelClass,
      ProjectionScope.OUTPUT,
      options,
    );
    if (isArray) return {type: DataType.ARRAY, items: dataSchema};
    return dataSchema;
  });
}
