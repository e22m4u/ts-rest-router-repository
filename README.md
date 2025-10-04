# @e22m4u/ts-rest-router-repository

Модуль экспортирует декораторы REST-маршрутизатора, позволяющие использовать
модели базы данных (TypeScript классы) для описания принимаемых и возвращаемых
данных запроса.

Модуль встраивается в связку:

- [@e22m4u/js-service](https://www.npmjs.com/package/@e22m4u/js-service)  
  \- сервис-локатор;
- [@e22m4u/ts-repository](https://www.npmjs.com/package/@e22m4u/ts-repository)  
  \- ORM/ODM для работы с базами данных;
- [@e22m4u/ts-rest-router](https://www.npmjs.com/package/@e22m4u/ts-rest-router)  
  \- REST-маршрутизатор на основе префиксного дерева;

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

Модули `ts-rest-router` и `js-repository` обычно работают в рамках одного
сервис-контейнера или корневого сервиса (*application*). Ниже рассматривается
первый вариант.

```js
import {RestRouter} from '@e22m4u/ts-rest-router';
import {ServiceContainer} from '@e22m4u/js-service';
import {DatabaseSchema} from '@e22m4u/js-trie-router';

const app = new ServiceContainer();
// инъекция маршрутизатора и схемы баз данных
const router = app.get(RestRouter);
const dbs = app.get(DatabaseSchema);
// инъекция сервиса RepositoryDataSchema
app.add(RepositoryDataSchema);
```

*i. MongoDB адаптер устанавливается отдельно (см. [js-repository-mongodb-adapter](https://www.npmjs.com/package/@e22m4u/js-repository-mongodb-adapter)).*

В примерах используется модель `City`, определение которой приводится ниже.

```ts
import {model} from '@e22m4u/ts-repository';
import {DataType} from '@e22m4u/ts-repository';
import {property} from '@e22m4u/ts-repository';

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
dbs.defineModelByClass(City);
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
import {postAction} from '@e22m4u/ts-rest-router';
import {restController} from '@e22m4u/ts-rest-router';
import {requestBodyWithModel} from '@e22m4u/ts-rest-router-repository';

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
import {postAction} from '@e22m4u/ts-rest-router';
import {restController} from '@e22m4u/ts-rest-router';
import {responseBodyWithModel} from '@e22m4u/ts-rest-router-repository';

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
    return {name: 'Moscow', codes: [38, 20150]};
  }
}

```

## Тесты

```bash
npm run test
```

## Лицензия

MIT
