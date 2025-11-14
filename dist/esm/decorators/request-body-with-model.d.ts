import { Flatten } from '../types.js';
import { DecoratorModelInput } from './types.js';
import { requestBody } from '@e22m4u/ts-rest-router';
import { DataSchemaOptions } from '@e22m4u/ts-repository-data-schema';
/**
 * Request body with model options.
 */
export type RequestBodyWithModelDecoratorOptions = Flatten<DataSchemaOptions & {
    required?: boolean;
}>;
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
export declare function requestBodyWithModel<T extends object>(model: DecoratorModelInput<T>, options?: RequestBodyWithModelDecoratorOptions): ReturnType<typeof requestBody>;
