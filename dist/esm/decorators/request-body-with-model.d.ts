import { ModelClass } from './types.js';
import { ModelClassOrFactory } from './types.js';
import { requestBody } from '@e22m4u/ts-rest-router';
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
export declare function requestBodyWithModel<T extends object>(model: ModelClassOrFactory<T> | [ModelClassOrFactory<T>] | (() => [ModelClass<T>])): ReturnType<typeof requestBody>;
