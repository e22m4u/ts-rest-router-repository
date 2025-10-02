import { DataType } from '@e22m4u/ts-data-schema';
import { responseBody } from '@e22m4u/ts-rest-router';
import { ProjectionScope } from '@e22m4u/ts-projection';
import { extractModelClassFromDecoratorInput } from './utils/index.js';
import { RouterRepositoryContext } from '../router-repository-context.js';
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
export function responseBodyWithModel(model, options) {
    const { modelClass, isArray } = extractModelClassFromDecoratorInput(responseBodyWithModel.name, model);
    const rrc = RouterRepositoryContext.getGlobalInstance();
    const rds = rrc.getRepositoryDataSchemaService();
    const dataSchema = rds.getDataSchemaByModelClass(modelClass, ProjectionScope.OUTPUT, options);
    if (isArray)
        return responseBody({ type: DataType.ARRAY, items: dataSchema });
    return responseBody(dataSchema);
}
