# @e22m4u/js-repository-rest-router

Модуль экспортирует содержимое пакета [@e22m4u/js-repository-data-schema](https://www.npmjs.com/package/@e22m4u/js-repository-data-schema)
и дополнительные декораторы REST-маршрутизатора, позволяющие использовать модели
базы данных (TypeScript классы) для описания принимаемых и возвращаемых данных
запроса.

REST-маршрутизатор [@e22m4u/ts-rest-router](https://www.npmjs.com/package/@e22m4u/ts-rest-router)  
Определение модели [@e22m4u/js-repository](https://www.npmjs.com/package/@e22m4u/js-repository#%D0%BC%D0%BE%D0%B4%D0%B5%D0%BB%D1%8C)  
Модель (TypeScript класс) [@e22m4u/js-repository-decorators](https://www.npmjs.com/package/@e22m4u/js-repository-decorators#%D0%9F%D1%80%D0%B8%D0%BC%D0%B5%D1%80)  

## Содержание

- [Установка](#установка)
  - [Поддержка декораторов](#поддержка-декораторов)
- [Начальная настройка](#начальная-настройка)
- [Декораторы](#декораторы)
  - [@requestBodyWithModel](#requestbodywithmodel)
  - [@responseBodyWithModel](#responsebodywithmodel)
- [Тесты](#тесты)
- [Лицензия](#лицензия)

## Установка

```bash
npm install @e22m4u/js-repository-rest-router
```

#### Поддержка декораторов

Для включения поддержки декораторов, добавьте указанные
ниже опции в файл `tsconfig.json` вашего проекта.

```json
{
  "emitDecoratorMetadata": true,
  "experimentalDecorators": true
}
```

## Начальная настройка

Прежде чем использовать декораторы, требуется выполнить инъекцию схемы
репозиториев `Schema` в глобальный экземпляр сервиса `RepositoryDataSchema`
как это показано ниже.

```ts
import {Schema} from '@e22m4u/js-repository';
import {repositoryDataSchema} from '@e22m4u/js-repository-rest-router';

const schema = new Schema();
repositoryDataSchema.setService(Schema, schema);
```

В примерах декораторов используется модель `City`, определение данной модели
находится ниже.

```ts
import {DataType} from '@e22m4u/js-repository';
import {model} from '@e22m4u/js-repository-decorators';
import {property} from '@e22m4u/js-repository-decorators';
import {getModelDefinitionFromClass} from '@e22m4u/js-repository-decorators';

// определение модели City с помощью декораторов
// (см. README.md пакета @e22m4u/js-repository-decorators)
@model()
class City {
  @property(DataType.STRING)
  name!: string;
  
  @property({
    type: DataType.ARRAY,
    itemType: DataType.NUMBER,
  })
  codes!: number[];
}

// регистрация модели City в схеме репозиториев
// (см. README.md пакета @e22m4u/js-repository-decorators)
schema.defineModel(getModelDefinitionFromClass(City));
```

## Декораторы

Модуль экспортирует следующие декораторы:

### @requestBodyWithModel

Декоратор-обертка для `@requestBody` принимает первым аргументом модель (класс),
массив с единственной моделью (создает схему массива объектов указанной схемы),
или фабрику возвращающую модель.

Определение:

```ts
/**
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
function requestBodyWithModel<T extends object>(
  model: DecoratorModelInput<T>
): ReturnType<typeof requestBody>
```

Пример:

```ts
import {requestBodyWithModel} from '@e22m4u/js-repository-rest-router';
// peerDependencies
import {postAction} from '@e22m4u/ts-rest-router';
import {restController} from '@e22m4u/ts-rest-router';

// определение контроллера CityController
// (см. README.md пакета @e22m4u/ts-rest-router)
@restController('cities')
class CityController {
  // объявление метода POST /cities
  // (использует базовый путь контроллера)
  @postAction()
  async create(
    // инъекция тела запроса указанной схемы,
    // данные будут проверены согласно модели
    @requestBodyWithModel(City) body: City,
  ) {
    // логика сохранения...
    return {status: 'success', received: body};
  }
}
```

### @responseBodyWithModel

Декоратор-обертка для `@responseBody` принимает первым аргументом модель (класс),
массив с единственной моделью (создает схему массива объектов указанной схемы),
или фабрику возвращающую модель.

Определение:

```ts
/**
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
function responseBodyWithModel<T extends object>(
  model: DecoratorModelInput<T>
): ReturnType<typeof responseBody>
```

Пример:

```ts
import {responseBodyWithModel} from '@e22m4u/js-repository-rest-router';
// peerDependencies
import {postAction} from '@e22m4u/ts-rest-router';
import {restController} from '@e22m4u/ts-rest-router';

// определение контроллера CityController
// (см. README.md пакета @e22m4u/ts-rest-router)
@restController('cities')
class CityController {
  // объявление метода POST /cities
  // (использует базовый путь контроллера)
  @postAction()
  // определение схемы данных возвращаемого
  // ответа согласно указанной модели
  @responseBodyWithModel(City)
  async create() {
    return {name: 'Pattaya', codes: [38, 20150]};
  }
}

```

## Тесты

```bash
npm run test
```

## Лицензия

MIT
