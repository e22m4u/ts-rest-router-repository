import {expect} from 'chai';
import {extractModelClassFromDecoratorInput} from './extract-model-class-from-decorator-input.js';

class MyModel {}
class AnotherModel {}

// Основной блок тестов
describe('extractModelClassFromDecoratorInput', function () {
  const decoratorName = 'testDecorator';

  describe('valid inputs', function () {
    it('should extract model class directly', function () {
      const result = extractModelClassFromDecoratorInput(
        decoratorName,
        MyModel,
      );
      expect(result.modelClass).to.equal(MyModel);
      expect(result.isArray).to.be.false;
    });

    it('should extract model class from an array', function () {
      const result = extractModelClassFromDecoratorInput(decoratorName, [
        MyModel,
      ]);
      expect(result.modelClass).to.equal(MyModel);
      expect(result.isArray).to.be.true;
    });

    it('should extract model class from a factory function', function () {
      const factory = () => MyModel;
      const result = extractModelClassFromDecoratorInput(
        decoratorName,
        factory,
      );
      expect(result.modelClass).to.equal(MyModel);
      expect(result.isArray).to.be.false;
    });

    it('should extract model class from a factory function returning an array', function () {
      const factory = () => [MyModel];
      const result = extractModelClassFromDecoratorInput(
        decoratorName,
        factory,
      );
      expect(result.modelClass).to.equal(MyModel);
      expect(result.isArray).to.be.true;
    });
  });

  describe('invalid inputs - array format issues', function () {
    it('should throw Error if array is empty', function () {
      expect(() =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        extractModelClassFromDecoratorInput(decoratorName, [] as any),
      ).to.throw(
        Error,
        /must contain exactly one model class, but 0 items given/,
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const factory = () => [] as any;
      expect(() =>
        extractModelClassFromDecoratorInput(decoratorName, factory),
      ).to.throw(
        Error,
        /must contain exactly one model class, but 0 items given/,
      );
    });

    it('should throw Error if array contains more than one model class', function () {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const input = [MyModel, AnotherModel] as any;
      expect(() =>
        extractModelClassFromDecoratorInput(decoratorName, input),
      ).to.throw(
        Error,
        /must contain exactly one model class, but 2 items given/,
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const factory = () => [MyModel, AnotherModel] as any;
      expect(() =>
        extractModelClassFromDecoratorInput(decoratorName, factory),
      ).to.throw(
        Error,
        /must contain exactly one model class, but 2 items given/,
      );
    });
  });

  describe('invalid inputs - not a class', function () {
    it('should throw Error if input is not a class', function () {
      const notAModel = {};
      expect(() =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        extractModelClassFromDecoratorInput(decoratorName, notAModel as any),
      ).to.throw(
        Error,
        /must be a model class, an array containing a single model class, or a factory function/,
      );
    });

    it('should throw Error if array contains a non-class item', function () {
      const notAModel = {};
      expect(() =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        extractModelClassFromDecoratorInput(decoratorName, [notAModel] as any),
      ).to.throw(
        Error,
        /must be a model class, an array containing a single model class, or a factory function/,
      );
    });

    it('should throw Error if factory returns a non-class item', function () {
      const notAModel = {};
      const factory = () => notAModel;
      expect(() =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        extractModelClassFromDecoratorInput(decoratorName, factory as any),
      ).to.throw(
        Error,
        /must be a model class, an array containing a single model class, or a factory function/,
      );
    });

    it('should throw Error if factory returns an array with a non-class item', function () {
      const notAModel = {};
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const factory = () => [notAModel] as any;
      expect(() =>
        extractModelClassFromDecoratorInput(decoratorName, factory),
      ).to.throw(
        Error,
        /must be a model class, an array containing a single model class, or a factory function/,
      );
    });

    it('should throw Error for null input', function () {
      expect(() =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        extractModelClassFromDecoratorInput(decoratorName, null as any),
      ).to.throw(
        Error,
        /must be a model class, an array containing a single model class, or a factory function/,
      );
    });

    it('should throw Error for undefined input', function () {
      expect(() =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        extractModelClassFromDecoratorInput(decoratorName, undefined as any),
      ).to.throw(
        Error,
        /must be a model class, an array containing a single model class, or a factory function/,
      );
    });

    it('should throw Error for a non-class function', function () {
      const nonClassFunction = function () {};
      expect(() =>
        extractModelClassFromDecoratorInput(
          decoratorName,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          nonClassFunction as any,
        ),
      ).to.throw(
        Error,
        /must be a model class, an array containing a single model class, or a factory function/,
      );
    });
  });
});
