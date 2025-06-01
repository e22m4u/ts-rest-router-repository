import {Constructor} from '../types.js';

/**
 * Модель (класс).
 */
export type ModelClass<T extends object> = Constructor<T>;

/**
 * Фабрика модели.
 */
export type ModelClassFactory<T extends object> = () => Constructor<T>;

/**
 * Массив с моделью.
 */
export type ModelClassArray<T extends object> = Constructor<T>[];

/**
 * Массив с фабрикой.
 */
export type ModelClassFactoryArray<T extends object> = () => Constructor<T>[];

/**
 * Модель или фабрика (описывает объект):
 *   MyModel
 *   () => MyModel
 *
 * Массив с моделью или фабрикой (описывает массив объектов):
 *   [MyModel]
 *   () => [MyModel]
 */
export type DecoratorModelInput<T extends object> =
  | ModelClass<T>
  | ModelClassArray<T>
  | ModelClassFactory<T>
  | ModelClassFactoryArray<T>;
