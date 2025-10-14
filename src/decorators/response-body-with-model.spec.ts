import {expect} from 'chai';
import {DataType} from '@e22m4u/js-data-schema';
import {ServiceContainer} from '@e22m4u/js-service';
import {DatabaseSchema} from '@e22m4u/js-repository';
import {model} from '@e22m4u/js-repository-decorators';
import {property} from '@e22m4u/js-repository-decorators';
import {DataSchemaFactory} from '@e22m4u/ts-rest-router';
import {ResponseBodyMetadata} from '@e22m4u/ts-rest-router';
import {ResponseBodyReflector} from '@e22m4u/ts-rest-router';
import {DataType as RepDataType} from '@e22m4u/js-repository';
import {responseBodyWithModel} from './response-body-with-model.js';
import {RepositoryDataSchema} from '@e22m4u/js-repository-data-schema';
import {getModelDefinitionFromClass} from '@e22m4u/js-repository-decorators';

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
