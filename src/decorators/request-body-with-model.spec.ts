/* eslint-disable @typescript-eslint/no-unused-vars */
import {expect} from 'chai';
import {DataType} from '@e22m4u/ts-data-schema';
import {ServiceContainer} from '@e22m4u/js-service';
import {DatabaseSchema} from '@e22m4u/js-repository';
import {model} from '@e22m4u/js-repository-decorators';
import {DataSchemaFactory} from '@e22m4u/ts-rest-router';
import {RequestDataMetadata} from '@e22m4u/ts-rest-router';
import {property} from '@e22m4u/js-repository-decorators';
import {RequestDataReflector} from '@e22m4u/ts-rest-router';
import {DataType as RepDataType} from '@e22m4u/js-repository';
import {requestBodyWithModel} from './request-body-with-model.js';
import {RepositoryDataSchema} from '@e22m4u/js-repository-data-schema';
import {getModelDefinitionFromClass} from '@e22m4u/js-repository-decorators';

describe('requestBodyWithModel', function () {
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
      method(
        @requestBodyWithModel(MyModel)
        body?: unknown,
      ) {}
    }
    const mdMap = RequestDataReflector.getMetadata(MyController, 'method');
    const md = mdMap.get(0) as RequestDataMetadata;
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

  it('should hide default values by default', function () {
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
      method(
        @requestBodyWithModel(MyModel)
        body?: unknown,
      ) {}
    }
    const mdMap = RequestDataReflector.getMetadata(MyController, 'method');
    const md = mdMap.get(0) as RequestDataMetadata;
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
        method(
          @requestBodyWithModel(MyModel, {skipDefaultValues: false})
          body?: unknown,
        ) {}
      }
      const mdMap = RequestDataReflector.getMetadata(MyController, 'method');
      const md = mdMap.get(0) as RequestDataMetadata;
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

    it('should allow to patch the "required" option in DataSchema', function () {
      const container = new ServiceContainer();
      const dbs = container.get(DatabaseSchema);
      container.use(RepositoryDataSchema);
      @model()
      class MyModel {}
      dbs.defineModel(getModelDefinitionFromClass(MyModel));
      class MyController {
        method(
          @requestBodyWithModel(MyModel, {required: true})
          body1?: unknown,
          @requestBodyWithModel(MyModel, {required: false})
          body2?: unknown,
        ) {}
      }
      const mdMap = RequestDataReflector.getMetadata(MyController, 'method');
      const md1 = mdMap.get(0) as RequestDataMetadata;
      const md2 = mdMap.get(1) as RequestDataMetadata;
      const factory1 = md1.schema as DataSchemaFactory;
      const factory2 = md2.schema as DataSchemaFactory;
      expect(factory1).to.be.a('function');
      expect(factory2).to.be.a('function');
      const res1 = factory1(container);
      const res2 = factory2(container);
      console.log(res1);
      expect(res1).to.be.eql({
        type: DataType.OBJECT,
        required: true,
      });
      expect(res2).to.be.eql({
        type: DataType.OBJECT,
        required: false,
      });
    });
  });
});
