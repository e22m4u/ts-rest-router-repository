import {Constructor} from '../types.js';

/**
 * Модель (класс).
 */
export type ModelClass<T extends object> = Constructor<T>;

/**
 * Модель (класс) или фабрика модели.
 */
export type ModelClassOrFactory<T extends object> =
  | ModelClass<T>
  | (() => ModelClass<T>);
