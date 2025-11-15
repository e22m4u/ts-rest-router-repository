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
  \- REST-маршрутизатор на основе контроллеров;

## Содержание

- [Установка](#установка)
  - [Поддержка декораторов](#поддержка-декораторов)
- [Начальная настройка](#начальная-настройка)
- [Декораторы](#декораторы)
  - [@requestBodyWithModel](#requestbodywithmodel)
  - [@responseBodyWithModel](#responsebodywithmodel)
- [Схемы данных](#схемы-данных)
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

Модули `ts-rest-router` и `ts-repository` обычно работают в рамках одного
сервис-контейнера или корневого сервиса (*application*). Ниже рассматривается
первый вариант.

```js
import {RestRouter} from '@e22m4u/ts-rest-router';
import {ServiceContainer} from '@e22m4u/js-service';
import {DatabaseSchema} from '@e22m4u/ts-repository';

const app = new ServiceContainer();
// инъекция маршрутизатора и схемы баз данных
const router = app.get(RestRouter);
const dbs = app.get(DatabaseSchema);
```

*i. MongoDB адаптер устанавливается отдельно (см. [js-repository-mongodb-adapter](https://www.npmjs.com/package/@e22m4u/js-repository-mongodb-adapter)).*

В примерах используется модель `City`, определение которой приводится ниже.

```ts
import {model, property, DataType} from '@e22m4u/ts-repository';

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
// (переменная `dbs` объявлена в начальном примере)
dbs.defineModelByClass(City);
```

## Декораторы

Модуль экспортирует следующие декораторы:

### @requestBodyWithModel

Декоратор-обертка для `@requestBody` принимает первым аргументом модель (класс),
массив с единственной моделью (создает схему массива объектов указанной схемы),
или фабрику возвращающую модель.

Сигнатура:

```ts
/**
 * Опции декоратора `@requestBodyWithModel`.
 */
export type RequestBodyWithModelDecoratorOptions = {
  applyDefaultValues?: boolean;
  required?: boolean;
  partial?: boolean;
};

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
 * @param options
 */
function requestBodyWithModel<T extends object>(
  model: DecoratorModelInput<T>,
  options?: RequestBodyWithModelDecoratorOptions,
): ReturnType<typeof requestBody>;
```

Параметры:

- `applyDefaultValues: boolean` *(по умолчанию `false`)*  
  Если `true`, автоматически подставляет значения по умолчанию указанные
  в модели для свойств объекта, если значения не были переданы при запросе.

- `required: boolean` *(по умолчанию `false`)*  
  Если `true`, требует наличия объекта модели в теле запроса, в противном
  случае выбрасывается ошибка.

- `partial: boolean` *(по умолчанию `false`)*  
  Если `true`, отключает проверку обязательных полей модели, позволяя
  передавать только часть данных (полезно для *PATCH*-запросов).

Пример:

```ts
import {postAction, restController} from '@e22m4u/ts-rest-router';
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

// регистрация контроллера в маршрутизаторе
// (переменная `router` объявлена в начальном примере)
router.addController(CityController);
```

### @responseBodyWithModel

Декоратор-обертка для `@responseBody` принимает первым аргументом модель (класс),
массив с единственной моделью (создает схему массива объектов указанной схемы),
или фабрику возвращающую модель.

Сигнатура:

```ts
/**
 * Опции декоратора `@responseBodyWithModel`.
 */
type ResponseBodyWithModelDecoratorOptions = {
  applyDefaultValues?: boolean;
};

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
 * @param options
 */
function responseBodyWithModel<T extends object>(
  model: DecoratorModelInput<T>,
  options?: ResponseBodyWithModelDecoratorOptions,
): ReturnType<typeof responseBody>;
```

Пример:

```ts
import {postAction, restController} from '@e22m4u/ts-rest-router';
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

// регистрация контроллера в маршрутизаторе
// (переменная `router` объявлена в начальном примере)
router.addController(CityController);
```

## Схемы данных

- [COUNT_RESULT_SCHEMA](#COUNT_RESULT_SCHEMA)
- [WHERE_CLAUSE_SCHEMA](#WHERE_CLAUSE_SCHEMA)
- [FILTER_CLAUSE_SCHEMA](#FILTER_CLAUSE_SCHEMA)
- [ITEM_FILTER_CLAUSE_SCHEMA](#ITEM_FILTER_CLAUSE_SCHEMA)
- [INCLUDE_CLAUSE_SCHEMA](#INCLUDE_CLAUSE_SCHEMA)

### COUNT_RESULT_SCHEMA

Схема результата работы метода репозитория `count`.

Определение:

```ts
import {DataType, DataSchema} from '@e22m4u/ts-data-schema';

/**
 * Count result schema.
 */
export const COUNT_RESULT_SCHEMA: DataSchema = {
  type: DataType.OBJECT,
  properties: {
    count: {
      type: DataType.NUMBER,
    }
  }
}
```

Пример:

```ts
import {City} from '../models/index.js';
import {WhereClause, DatabaseSchema} from '@e22m4u/ts-repository';
import {getAction, requestQuery, responseBody} from '@e22m4u/ts-rest-router';

import {
  COUNT_RESULT_SCHEMA,
  WHERE_CLAUSE_SCHEMA,
} from '@e22m4u/ts-rest-router-repository';

class CityController {
  @getAction()
  @responseBody(COUNT_RESULT_SCHEMA)
  async count(
    @requestQuery('where', WHERE_CLAUSE_SCHEMA)
    where?: WhereClause
  ) {
    const dbs = this.getService(DatabaseSchema);
    const rep = dbs.getRepositoryByModelClass(City);
    return rep.count(where);
  }
}
```

### WHERE_CLAUSE_SCHEMA

Схема объекта выборки для методов репозитория `count` и `delete`.

Определение:

```ts
import {DataType, DataSchema} from '@e22m4u/ts-data-schema';

/**
 * Where clause schema.
 */
export const WHERE_CLAUSE_SCHEMA: DataSchema = {
  type: DataType.OBJECT,
  default: () => ({}),
};
```

Пример:

```ts
import {City} from '../models/index.js';
import {WhereClause} from '@e22m4u/ts-repository';
import {DatabaseSchema} from '@e22m4u/ts-repository';
import {deleteAction, requestQuery, responseBody} from '@e22m4u/ts-rest-router';

import {
  COUNT_RESULT_SCHEMA,
  WHERE_CLAUSE_SCHEMA,
} from '@e22m4u/ts-rest-router-repository';

class CityController {
  @deleteAction()
  @responseBody(COUNT_RESULT_SCHEMA)
  async delete(
    @requestQuery('where', WHERE_CLAUSE_SCHEMA)
    where?: WhereClause,
  ) {
    const dbs = this.getService(DatabaseSchema);
    const rep = dbs.getRepositoryByModelClass(City);
    return rep.delete(where);
  }
}
```

### FILTER_CLAUSE_SCHEMA

Схема объекта фильтрации для метода репозитория `find` и `findOne`.

Определение:

```ts
import {DataType, DataSchema} from '@e22m4u/ts-data-schema';

/**
 * Filter clause schema.
 */
export const FILTER_CLAUSE_SCHEMA: DataSchema = {
  type: DataType.OBJECT,
  properties: {
    where: {
      type: DataType.OBJECT,
      default: () => ({}),
    },
    order: {
      type: DataType.ANY,
      default: () => [],
    },
    limit: {
      type: DataType.NUMBER,
      default: 10,
    },
    skip: {
      type: DataType.NUMBER,
      default: 0,
    },
    fields: {
      type: DataType.ARRAY,
      items: {type: DataType.STRING},
      default: () => [],
    },
    include: {
      type: DataType.ANY,
      default: () => [],
    },
  },
};
```

Пример:

```ts
import {City} from '../models/index.js';
import {getAction, requestQuery} from '@e22m4u/ts-rest-router';
import {FilterClause, DatabaseSchema} from '@e22m4u/ts-repository';

import {
  FILTER_CLAUSE_SCHEMA,
  responseBodyWithModel,
} from '@e22m4u/ts-rest-router-repository';

class CityController {
  @getAction()
  @responseBodyWithModel([City])
  async find(
    @requestQuery('filter', FILTER_CLAUSE_SCHEMA)
    filter?: FilterClause
  ) {
    const dbs = this.getService(DatabaseSchema);
    const rep = dbs.getRepositoryByModelClass(City);
    return rep.find(filter);
  }
}
```

### ITEM_FILTER_CLAUSE_SCHEMA

Схема объекта фильтрации для методов репозитория:

- `create`
- `replaceById`
- `replaceOrCreate`
- `patchById`
- `findById`

Определение:

```ts
import {DataType, DataSchema} from '@e22m4u/ts-data-schema';

/**
 * Item filter clause schema.
 */
export const ITEM_FILTER_CLAUSE_SCHEMA: DataSchema = {
  type: DataType.OBJECT,
  properties: {
    fields: {
      type: DataType.ARRAY,
      items: {type: DataType.STRING},
      default: () => [],
    },
    include: {
      type: DataType.ANY,
      default: () => [],
    },
  },
};
```

Пример:

```ts
import {City} from '../models/index.js';
import {DatabaseSchema, ItemFilterClause} from '@e22m4u/ts-repository';
import {getAction, requestQuery, requestParam} from '@e22m4u/ts-rest-router';

import {
  responseBodyWithModel,
  ITEM_FILTER_CLAUSE_SCHEMA,
} from '@e22m4u/ts-rest-router-repository';

class CityController {
  @getAction(':id')
  @responseBodyWithModel(City)
  async findById(
    @requestParam('id', {required: true})
    id: string,
    @requestQuery('filter', ITEM_FILTER_CLAUSE_SCHEMA)
    filter?: ItemFilterClause,
  ) {
    const dbs = this.getService(DatabaseSchema);
    const rep = dbs.getRepositoryByModelClass(City);
    return rep.findById(id, filter);
  }
}
```

### INCLUDE_CLAUSE_SCHEMA

Схема включения связанных данных в ответ (для частных случаев).

Определение:

```ts
import {DataType, DataSchema} from '@e22m4u/ts-data-schema';

/**
 * Include clause schema.
 */
export const INCLUDE_CLAUSE_SCHEMA: DataSchema = {
  type: DataType.ANY,
  default: () => [],
};

```

Пример:

```ts
import {IncludeClause} from '@e22m4u/ts-repository';
import {getAction, requestQuery, requestParam} from '@e22m4u/ts-rest-router';

import {
  responseBodyWithModel,
  INCLUDE_CLAUSE_SCHEMA,
} from '@e22m4u/ts-rest-router-repository';

class UserController {
  // получение пользователя с опциональным включением связанных данных
  @getAction(':id')
  @responseBodyWithModel(User)
  async findUserById(
    @requestParam('id') id: string,
    @requestQuery('include', INCLUDE_CLAUSE_SCHEMA)
    include?: IncludeClause,
  ) {
    // логика поиска пользователя с использованием `include`
    // например, rep.findById(id, { include: include });
  }
}
```

## Тесты

```bash
npm run test
```

## Лицензия

MIT
