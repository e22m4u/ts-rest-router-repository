# @e22m4u/js-repository-rest-router

Модуль экспортирует содержимое пакета [@e22m4u/js-repository-data-schema](https://www.npmjs.com/package/@e22m4u/js-repository-data-schema)
и дополнительные декораторы REST-маршрутизатора, позволяющие использовать модели
базы данных (TypeScript классы) для описания принимаемых и возвращаемых данных
запроса.

REST-маршрутизатор [@e22m4u/ts-rest-router](https://www.npmjs.com/package/@e22m4u/ts-rest-router)  
Определение модели [@e22m4u/js-repository](https://www.npmjs.com/package/@e22m4u/js-repository#%D0%BC%D0%BE%D0%B4%D0%B5%D0%BB%D1%8C)  
Модель (TypeScript класс) [@e22m4u/js-repository-decorators](https://www.npmjs.com/package/@e22m4u/js-repository-decorators#%D0%9F%D1%80%D0%B8%D0%BC%D0%B5%D1%80)  

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

## Использование

Прежде чем использовать декораторы, требуется выполнить инъекцию схемы
репозиториев `Schema` в глобальный экземпляр сервиса `RepositoryDataSchema` как
это показано ниже.

```ts
import {Schema} from '@e22m4u/js-repository';
import {repositoryDataSchema} from '@e22m4u/js-repository-rest-router';

const schema = new Schema();
repositoryDataSchema.setService(Schema, schema);
```

### @requestBodyWithModel

Декоратор-обертка для `@requestBody` принимает первым аргументом модель (класс),
массив с единственной моделью (создает схему массива объектов указанной схемы),
или фабрику возвращающую модель.

Определение:

```ts
function requestBodyWithModel<T extends object>(
  model: ModelClassOrFactory<T>
    | [ModelClassOrFactory<T>]
    | (() => [ModelClass<T>])
): ReturnType<typeof requestBody>
```

Пример:

```ts
import {repositoryDataSchema} from '@e22m4u/js-repository-rest-router';
import {requestBodyWithModel} from '@e22m4u/js-repository-rest-router';
// peerDependencies
import {Schema} from '@e22m4u/js-repository';
import {DataType} from '@e22m4u/js-repository';
import {postAction} from '@e22m4u/ts-rest-router';
import {restController} from '@e22m4u/ts-rest-router';
import {model} from '@e22m4u/js-repository-decorators';
import {property} from '@e22m4u/js-repository-decorators';
import {getModelDefinitionFromClass} from '@e22m4u/js-repository-decorators';

// иньекция схемы репозиториев
// (см. первый параграф «Использование»)
const schema = new Schema();
repositoryDataSchema.setService(Schema, schema);

// определение модели City с помощью декораторов
// (см. README.md пакета @e22m4u/js-repository-decorators)
@model()
class City {
  @property(RepDataType.STRING)
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
    // ...
  }
}

```

## Тесты

```bash
npm run test
```

## Лицензия

MIT
