# @e22m4u/ts-rest-router-repository

Модуль экспортирует декораторы REST-маршрутизатора, позволяющие использовать
модели базы данных (TypeScript классы) для описания принимаемых и возвращаемых
данных запроса.

REST-маршрутизатор [@e22m4u/ts-rest-router](https://www.npmjs.com/package/@e22m4u/ts-rest-router)  
Определение модели [@e22m4u/js-repository-decorators](https://www.npmjs.com/package/@e22m4u/js-repository-decorators#%D0%9F%D1%80%D0%B8%D0%BC%D0%B5%D1%80)  

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
npm install @e22m4u/ts-rest-router-repository
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

Прежде чем использовать декораторы, требуется создать экземпляр класса
`RouterRepositoryContext` и выполнить инъекцию сервиса `DatabaseSchema`
(схема базы данных) в данный экземпляр, как это показано ниже.

```ts
import {DatabaseSchema} from '@e22m4u/js-repository';
import {RouterRepositoryContext} from '@e22m4u/ts-rest-router-repository';

const dbs = new DatabaseSchema();
const rrc = new RouterRepositoryContext();
rrc.setService(DatabaseSchema, dbs);
```

В примерах декораторов используется модель `City`, определение данной модели
находится ниже.

```ts
import {DataType} from '@e22m4u/js-repository';
import {model} from '@e22m4u/js-repository-decorators';
import {property} from '@e22m4u/js-repository-decorators';
import {getModelDefinitionFromClass} from '@e22m4u/js-repository-decorators';

// определение модели City с помощью декораторов
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

// регистрация модели City в схеме базы данных
// (переменная `dbs` является экземпляром DatabaseSchema)
dbs.defineModel(getModelDefinitionFromClass(City));
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
import {requestBodyWithModel} from '@e22m4u/ts-rest-router-repository';
// peerDependencies
import {postAction} from '@e22m4u/ts-rest-router';
import {restController} from '@e22m4u/ts-rest-router';

// определение контроллера
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
import {responseBodyWithModel} from '@e22m4u/ts-rest-router-repository';
// peerDependencies
import {postAction} from '@e22m4u/ts-rest-router';
import {restController} from '@e22m4u/ts-rest-router';

// определение контроллера
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
