import {ModelClass} from '../types.js';
import {Errorf} from '@e22m4u/js-format';
import {isClass} from '../../utils/index.js';
import {DecoratorModelInput} from '../types.js';

/**
 * Результат извлечения модели из аргумента декоратора,
 * включая флаг массива (если это модель элемента массива).
 */
type ModelClassExtractionResult<T extends object> = {
  modelClass: ModelClass<T>;
  isArray: boolean;
};

/**
 * Вспомогательная функция для извлечения модели из аргумента декоратора.
 *
 * @param decoratorName
 * @param modelInput
 */
export function extractModelClassFromDecoratorInput<T extends object>(
  decoratorName: string,
  modelInput: DecoratorModelInput<T>,
): ModelClassExtractionResult<T> {
  // если передана фабрика,
  // то извлекается значение
  //   modelInput is () => MyModel
  //   modelInput is () => [MyModel]
  if (typeof modelInput === 'function' && !isClass(modelInput)) {
    modelInput = modelInput();
  }
  // если передан массив,
  // то извлекается первый элемент
  //   modelInput is [MyModel]
  let modelClass: ModelClass<T>;
  let isArray = false;
  if (Array.isArray(modelInput)) {
    isArray = true;
    // массив должен содержать ровно один элемент
    if (modelInput.length !== 1) {
      throw new Errorf(
        'If an array (or a factory returning an array) is passed to @%s, ' +
          'it must contain exactly one model class, but %v items given.',
        decoratorName,
        (modelInput as unknown[]).length,
      );
    }
    modelClass = modelInput[0];
  } else {
    modelClass = modelInput;
  }
  // если в результате модель не получена,
  // то выбрасывается ошибка
  //   modelClass is not MyModel
  if (!isClass(modelClass))
    throw new Errorf(
      'The first argument of @%s must be a model class, ' +
        'an array containing a single model class, ' +
        'or a factory function of these values.',
      decoratorName,
    );
  return {modelClass, isArray};
}
