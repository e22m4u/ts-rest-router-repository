import { DecoratorModelInput } from './types.js';
import { responseBody } from '@e22m4u/ts-rest-router';
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
export declare function responseBodyWithModel<T extends object>(model: DecoratorModelInput<T>): ReturnType<typeof responseBody>;
