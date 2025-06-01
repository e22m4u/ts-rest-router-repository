import { ModelClass } from '../types.js';
import { DecoratorModelInput } from '../types.js';
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
export declare function extractModelClassFromDecoratorInput<T extends object>(decoratorName: string, modelInput: DecoratorModelInput<T>): ModelClassExtractionResult<T>;
export {};
