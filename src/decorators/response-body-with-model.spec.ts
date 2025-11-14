import {expect} from 'chai';
import {DataType} from '@e22m4u/ts-data-schema';
import {ServiceContainer} from '@e22m4u/js-service';
import {responseBodyWithModel} from './response-body-with-model.js';
import {RepositoryDataSchema} from '@e22m4u/ts-repository-data-schema';

import {
  DataSchemaFactory,
  ResponseBodyMetadata,
  ResponseBodyReflector,
} from '@e22m4u/ts-rest-router';

import {
  model,
  property,
  DatabaseSchema,
  DataType as RepDataType,
  getModelDefinitionFromClass,
} from '@e22m4u/ts-repository';

describe('responseBodyWithModel', function () {
  it('set DataSchema by model class', function () {
    const container = new ServiceContainer();
    const dbs = container.get(DatabaseSchema);
    container.use(RepositoryDataSchema);
    @model()
    class MyModel {
      @property(RepDataType.STRING)
      prop1!: string;
      @property(RepDataType.NUMBER)
      prop2!: number;
    }
    dbs.defineModel(getModelDefinitionFromClass(MyModel));
    class MyController {
      @responseBodyWithModel(MyModel)
      method() {}
    }
    const mdMap = ResponseBodyReflector.getMetadata(MyController);
    const md = mdMap.get('method') as ResponseBodyMetadata;
    const factory = md.schema as DataSchemaFactory;
    expect(factory).to.be.a('function');
    const res = factory(container);
    expect(res).to.be.eql({
      type: DataType.OBJECT,
      properties: {
        prop1: {type: DataType.STRING},
        prop2: {type: DataType.NUMBER},
      },
    });
  });

  it('should use default values by default', function () {
    const container = new ServiceContainer();
    const dbs = container.get(DatabaseSchema);
    container.use(RepositoryDataSchema);
    @model()
    class MyModel {
      @property({type: RepDataType.STRING, default: 'value'})
      prop1!: string;
      @property({type: RepDataType.NUMBER, default: 10})
      prop2!: number;
    }
    dbs.defineModel(getModelDefinitionFromClass(MyModel));
    class MyController {
      @responseBodyWithModel(MyModel)
      method() {}
    }
    const mdMap = ResponseBodyReflector.getMetadata(MyController);
    const md = mdMap.get('method') as ResponseBodyMetadata;
    const factory = md.schema as DataSchemaFactory;
    expect(factory).to.be.a('function');
    const res = factory(container);
    expect(res).to.be.eql({
      type: DataType.OBJECT,
      properties: {
        prop1: {type: DataType.STRING, default: 'value'},
        prop2: {type: DataType.NUMBER, default: 10},
      },
    });
  });

  describe('options', function () {
    it('should use the given options to manager default values', function () {
      const container = new ServiceContainer();
      const dbs = container.get(DatabaseSchema);
      container.use(RepositoryDataSchema);
      @model()
      class MyModel {
        @property({type: RepDataType.STRING, default: 'value'})
        prop1!: string;
        @property({type: RepDataType.NUMBER, default: 10})
        prop2!: number;
      }
      dbs.defineModel(getModelDefinitionFromClass(MyModel));
      class MyController {
        @responseBodyWithModel(MyModel, {skipDefaultValues: true})
        method() {}
      }
      const mdMap = ResponseBodyReflector.getMetadata(MyController);
      const md = mdMap.get('method') as ResponseBodyMetadata;
      const factory = md.schema as DataSchemaFactory;
      expect(factory).to.be.a('function');
      const res = factory(container);
      expect(res).to.be.eql({
        type: DataType.OBJECT,
        properties: {
          prop1: {type: DataType.STRING},
          prop2: {type: DataType.NUMBER},
        },
      });
    });
  });
});
