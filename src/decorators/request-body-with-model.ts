import {ModelClass} from './types.js';
import {Errorf} from '@e22m4u/js-format';
import {isClass} from '../utils/index.js';
import {ModelClassOrFactory} from './types.js';
import {DataType} from '@e22m4u/ts-data-schema';
import {requestBody} from '@e22m4u/ts-rest-router';
import {ProjectionScope} from '@e22m4u/ts-projection';
import {getDataSchemaByModelClass} from '@e22m4u/js-repository-data-schema';

/**
 * Декоратор-обертка для @requestBody, который позволяет передавать
 * первым аргументом модель (класс), массив с единственной моделью
 * (указывает на массив элементов), или фабрику возвращающую модель
 * или массив с моделью.
 *
 * Схема тела с объектом:
 *   @requestBodyWithModel(MyModel)
 *   @requestBodyWithModel(() => MyModel)
 *
 * Схема тела с массивом объектов:
 *   @requestBodyWithModel([MyModel])
 *   @requestBodyWithModel(() => [MyModel])
 *   @requestBodyWithModel([() => MyModel])
 *
 * @param model
 */
export function requestBodyWithModel<T extends object>(
  model:
    | ModelClassOrFactory<T>
    | [ModelClassOrFactory<T>]
    | (() => [ModelClass<T>]),
): ReturnType<typeof requestBody> {
  // если передана фабрика,
  // то извлекаем значение
  //   model is () => MyModel
  //   model is () => [MyModel]
  if (typeof model === 'function' && !isClass(model)) {
    model = model();
  }
  // если передан массив,
  // то извлекаем первый элемент
  //   model is [MyModel]
  let isArray = false;
  let modelOrFactory: ModelClassOrFactory<T>;
  if (Array.isArray(model)) {
    isArray = true;
    modelOrFactory = model[0];
  } else {
    modelOrFactory = model;
  }
  // если полученное значение является
  // фабрикой, то извлекаем значение фабрики
  //   modelOrFactory is () => MyModel
  //   modelOrFactory is () => [MyModel]
  let modelClass: ModelClass<T> | undefined;
  if (typeof modelOrFactory === 'function' && !isClass(modelOrFactory)) {
    modelClass = modelOrFactory();
  } else if (isClass(modelOrFactory)) {
    modelClass = modelOrFactory;
  }
  // если в результате мы так и не получили
  // модель, то выбрасываем ошибку
  //   modelClass is not MyModel
  if (!isClass(modelClass))
    throw new Errorf(
      'The first argument of @requestBodyWithModel must be a model class, ' +
        'an array (containing a model class or a model factory), ' +
        'or a factory function (returning either a model class ' +
        'or an array containing a model class).',
    );
  const modelSchema = getDataSchemaByModelClass(
    modelClass,
    ProjectionScope.INPUT,
  );
  if (isArray) return requestBody({type: DataType.ARRAY, items: modelSchema});
  return requestBody(modelSchema);
}
