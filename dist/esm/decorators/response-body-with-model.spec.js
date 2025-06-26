var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { expect } from 'chai';
import { DataType } from '@e22m4u/ts-data-schema';
import { DatabaseSchema } from '@e22m4u/js-repository';
import { model } from '@e22m4u/js-repository-decorators';
import { property } from '@e22m4u/js-repository-decorators';
import { ResponseBodyReflector } from '@e22m4u/ts-rest-router';
import { DataType as RepDataType } from '@e22m4u/js-repository';
import { responseBodyWithModel } from './response-body-with-model.js';
import { RepositoryDataSchema } from '@e22m4u/js-repository-data-schema';
import { RouterRepositoryContext } from '../router-repository-context.js';
import { getModelDefinitionFromClass } from '@e22m4u/js-repository-decorators';
describe('responseBodyWithModel', function () {
    it('set DataSchema by model class', function () {
        const dbs = new DatabaseSchema();
        const rds = new RepositoryDataSchema();
        const rrc = new RouterRepositoryContext();
        rds.setService(DatabaseSchema, dbs);
        rrc.setService(RepositoryDataSchema, rds);
        let MyModel = class MyModel {
            prop1;
            prop2;
        };
        __decorate([
            property(RepDataType.STRING),
            __metadata("design:type", String)
        ], MyModel.prototype, "prop1", void 0);
        __decorate([
            property(RepDataType.NUMBER),
            __metadata("design:type", Number)
        ], MyModel.prototype, "prop2", void 0);
        MyModel = __decorate([
            model()
        ], MyModel);
        dbs.defineModel(getModelDefinitionFromClass(MyModel));
        class MyController {
            method() { }
        }
        __decorate([
            responseBodyWithModel(MyModel),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", []),
            __metadata("design:returntype", void 0)
        ], MyController.prototype, "method", null);
        const mdMap = ResponseBodyReflector.getMetadata(MyController);
        const res = mdMap.get('method');
        expect(res).to.be.eql({
            schema: {
                type: DataType.OBJECT,
                properties: {
                    prop1: { type: DataType.STRING },
                    prop2: { type: DataType.NUMBER },
                },
            },
        });
    });
});
