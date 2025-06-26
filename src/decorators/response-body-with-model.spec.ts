import {expect} from 'chai';
import {DataType} from '@e22m4u/ts-data-schema';
import {DatabaseSchema} from '@e22m4u/js-repository';
import {model} from '@e22m4u/js-repository-decorators';
import {property} from '@e22m4u/js-repository-decorators';
import {ResponseBodyReflector} from '@e22m4u/ts-rest-router';
import {DataType as RepDataType} from '@e22m4u/js-repository';
import {responseBodyWithModel} from './response-body-with-model.js';
import {RepositoryDataSchema} from '@e22m4u/js-repository-data-schema';
import {RouterRepositoryContext} from '../router-repository-context.js';
import {getModelDefinitionFromClass} from '@e22m4u/js-repository-decorators';

describe('responseBodyWithModel', function () {
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
      @responseBodyWithModel(MyModel)
      method() {}
    }
    const mdMap = ResponseBodyReflector.getMetadata(MyController);
    const res = mdMap.get('method');
    expect(res).to.be.eql({
      schema: {
        type: DataType.OBJECT,
        properties: {
          prop1: {type: DataType.STRING},
          prop2: {type: DataType.NUMBER},
        },
      },
    });
  });
});
