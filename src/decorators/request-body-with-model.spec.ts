/* eslint-disable @typescript-eslint/no-unused-vars */
import {expect} from 'chai';
import {DataType} from '@e22m4u/ts-data-schema';
import {DatabaseSchema} from '@e22m4u/js-repository';
import {model} from '@e22m4u/js-repository-decorators';
import {RequestDataSource} from '@e22m4u/ts-rest-router';
import {property} from '@e22m4u/js-repository-decorators';
import {RequestDataReflector} from '@e22m4u/ts-rest-router';
import {DataType as RepDataType} from '@e22m4u/js-repository';
import {requestBodyWithModel} from './request-body-with-model.js';
import {RepositoryDataSchema} from '@e22m4u/js-repository-data-schema';
import {RouterRepositoryContext} from '../router-repository-context.js';
import {getModelDefinitionFromClass} from '@e22m4u/js-repository-decorators';

describe('requestBodyWithModel', function () {
  it('set DataSchema by model class', function () {
    const dbs = new DatabaseSchema();
    const rds = new RepositoryDataSchema();
    const rrc = new RouterRepositoryContext();
    rds.setService(DatabaseSchema, dbs);
    rrc.setService(RepositoryDataSchema, rds);
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
        body: MyModel,
      ) {}
    }
    const mdMap = RequestDataReflector.getMetadata(MyController, 'method');
    const res = mdMap.get(0);
    expect(res).to.be.eql({
      source: RequestDataSource.BODY,
      schema: {
        type: DataType.OBJECT,
        properties: {
          prop1: {type: DataType.STRING},
          prop2: {type: DataType.NUMBER},
        },
      },
    });
  });

  it('should hide default values by default', function () {
    const dbs = new DatabaseSchema();
    const rds = new RepositoryDataSchema();
    const rrc = new RouterRepositoryContext();
    rds.setService(DatabaseSchema, dbs);
    rrc.setService(RepositoryDataSchema, rds);
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
        body: MyModel,
      ) {}
    }
    const mdMap = RequestDataReflector.getMetadata(MyController, 'method');
    const res = mdMap.get(0);
    expect(res).to.be.eql({
      source: RequestDataSource.BODY,
      schema: {
        type: DataType.OBJECT,
        properties: {
          prop1: {type: DataType.STRING},
          prop2: {type: DataType.NUMBER},
        },
      },
    });
  });

  describe('options', function () {
    it('should use the given options to manager default values', function () {
      const dbs = new DatabaseSchema();
      const rds = new RepositoryDataSchema();
      const rrc = new RouterRepositoryContext();
      rds.setService(DatabaseSchema, dbs);
      rrc.setService(RepositoryDataSchema, rds);
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
          body: MyModel,
        ) {}
      }
      const mdMap = RequestDataReflector.getMetadata(MyController, 'method');
      const res = mdMap.get(0);
      expect(res).to.be.eql({
        source: RequestDataSource.BODY,
        schema: {
          type: DataType.OBJECT,
          properties: {
            prop1: {type: DataType.STRING, default: 'value'},
            prop2: {type: DataType.NUMBER, default: 10},
          },
        },
      });
    });
  });
});
