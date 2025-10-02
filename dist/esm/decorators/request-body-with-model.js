import { DataType } from '@e22m4u/ts-data-schema';
import { requestBody } from '@e22m4u/ts-rest-router';
import { ProjectionScope } from '@e22m4u/ts-projection';
import { extractModelClassFromDecoratorInput } from './utils/index.js';
import { RouterRepositoryContext } from '../router-repository-context.js';
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
export function requestBodyWithModel(model, options) {
    const { modelClass, isArray } = extractModelClassFromDecoratorInput(requestBodyWithModel.name, model);
    const rrc = RouterRepositoryContext.getGlobalInstance();
    const rds = rrc.getRepositoryDataSchemaService();
    const dataSchema = rds.getDataSchemaByModelClass(modelClass, ProjectionScope.INPUT, { skipDefaultValues: true, ...options });
    if (isArray)
        return requestBody({ type: DataType.ARRAY, items: dataSchema });
    return requestBody(dataSchema);
}
