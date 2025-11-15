/* eslint-disable @typescript-eslint/no-unused-vars */
import {expect} from 'chai';
import {DataType} from '@e22m4u/ts-data-schema';
import {ServiceContainer} from '@e22m4u/js-service';
import {requestBodyWithModel} from './request-body-with-model.js';
import {RepositoryDataSchema} from '@e22m4u/ts-repository-data-schema';

import {
  model,
  property,
  DatabaseSchema,
  DataType as RepDataType,
} from '@e22m4u/ts-repository';

import {
  DataSchemaFactory,
  RequestDataMetadata,
  RequestDataReflector,
} from '@e22m4u/ts-rest-router';

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
    dbs.defineModelByClass(MyModel);
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

  it('should set the "default" option as "oaDefault"', function () {
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
    dbs.defineModelByClass(MyModel);
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
        prop1: {type: DataType.STRING, oaDefault: 'value'},
        prop2: {type: DataType.NUMBER, oaDefault: 10},
      },
    });
  });

  describe('options', function () {
    it('should not convert the "default" option to "oaDefault" when the "applyDefaultValues" is true', function () {
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
      dbs.defineModelByClass(MyModel);
      class MyController {
        method(
          @requestBodyWithModel(MyModel, {applyDefaultValues: true})
          body1?: unknown,
          @requestBodyWithModel(MyModel, {applyDefaultValues: false})
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
      expect(res1).to.be.eql({
        type: DataType.OBJECT,
        properties: {
          prop1: {type: DataType.STRING, default: 'value'},
          prop2: {type: DataType.NUMBER, default: 10},
        },
      });
      expect(res2).to.be.eql({
        type: DataType.OBJECT,
        properties: {
          prop1: {type: DataType.STRING, oaDefault: 'value'},
          prop2: {type: DataType.NUMBER, oaDefault: 10},
        },
      });
    });

    it('should allow to patch the "required" option in DataSchema', function () {
      const container = new ServiceContainer();
      const dbs = container.get(DatabaseSchema);
      container.use(RepositoryDataSchema);
      @model()
      class MyModel {}
      dbs.defineModelByClass(MyModel);
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
      expect(res1).to.be.eql({
        type: DataType.OBJECT,
        required: true,
      });
      expect(res2).to.be.eql({
        type: DataType.OBJECT,
        required: false,
      });
    });

    it('should skip the "required" options of model definition if the "partial" option is true', function () {
      const container = new ServiceContainer();
      const dbs = container.get(DatabaseSchema);
      container.use(RepositoryDataSchema);
      @model()
      class MyModel {
        @property({
          type: RepDataType.STRING,
          required: true,
        })
        prop!: string;
      }
      dbs.defineModelByClass(MyModel);
      class MyController {
        method(
          @requestBodyWithModel(MyModel, {partial: true})
          body1?: unknown,
          @requestBodyWithModel(MyModel, {partial: false})
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
      expect(res1).to.be.eql({
        type: DataType.OBJECT,
        properties: {
          prop: {
            type: DataType.STRING,
          },
        },
      });
      expect(res2).to.be.eql({
        type: DataType.OBJECT,
        properties: {
          prop: {
            type: DataType.STRING,
            required: true,
          },
        },
      });
    });

    it('should not affect the default options behavior when the "partial" option is true', function () {
      const container = new ServiceContainer();
      const dbs = container.get(DatabaseSchema);
      container.use(RepositoryDataSchema);
      @model()
      class MyModel {
        @property({
          type: RepDataType.STRING,
          required: true,
        })
        prop1!: string;
        @property({
          type: RepDataType.STRING,
          default: 'value',
        })
        prop2!: string;
      }
      dbs.defineModelByClass(MyModel);
      class MyController {
        method(
          @requestBodyWithModel(MyModel, {partial: true})
          body1?: unknown,
          @requestBodyWithModel(MyModel, {partial: false})
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
      expect(res1).to.be.eql({
        type: DataType.OBJECT,
        properties: {
          prop1: {
            type: DataType.STRING,
          },
          prop2: {
            type: DataType.STRING,
            oaDefault: 'value',
          },
        },
      });
      expect(res2).to.be.eql({
        type: DataType.OBJECT,
        properties: {
          prop1: {
            type: DataType.STRING,
            required: true,
          },
          prop2: {
            type: DataType.STRING,
            oaDefault: 'value',
          },
        },
      });
    });
  });
});
