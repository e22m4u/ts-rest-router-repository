import {expect} from 'chai';
import {DatabaseSchema} from '@e22m4u/js-repository';
import {RepositoryDataSchema} from '@e22m4u/js-repository-data-schema';
import {RouterRepositoryContext} from './router-repository-context.js';

describe('RouterRepositoryContext', function () {
  beforeEach(function () {
    RouterRepositoryContext.removeGlobalInstance();
  });

  describe('constructor', function () {
    it('sets current instance as global if no registered instance', function () {
      const res1 = RouterRepositoryContext.hasGlobalInstance();
      expect(res1).to.be.false;
      const res2 = new RouterRepositoryContext();
      new RouterRepositoryContext();
      const res3 = RouterRepositoryContext.getGlobalInstance();
      expect(res2).to.be.eq(res3);
    });
  });

  describe('getRepositoryDataSchemaService', function () {
    it('throws Error if no DatabaseSchema instance registered', function () {
      const rrc = new RouterRepositoryContext();
      const throwable = () => rrc.getRepositoryDataSchemaService();
      expect(throwable).to.throw(
        Error,
        'A DatabaseSchema instance must be registered ' +
          'in the RouterRepositoryContext service.',
      );
    });

    it('returns a new instance of the RouterRepositoryContext class and uses it as singleton', function () {
      const rrc = new RouterRepositoryContext();
      const dbs = new DatabaseSchema();
      rrc.setService(DatabaseSchema, dbs);
      const res1 = rrc.getRepositoryDataSchemaService();
      const res2 = rrc.getRepositoryDataSchemaService();
      expect(res1).to.be.instanceof(RepositoryDataSchema);
      expect(res1).to.be.eq(res2);
    });

    it('returns a registered instance of the RouterRepositoryContext class', function () {
      const rrc = new RouterRepositoryContext();
      const rds = new RepositoryDataSchema();
      const dbs = new DatabaseSchema();
      rrc.setService(RepositoryDataSchema, rds);
      rds.setService(DatabaseSchema, dbs);
      const res = rrc.getRepositoryDataSchemaService();
      expect(res).to.be.eq(rds);
    });
  });

  describe('setGlobalInstance', function () {
    it('sets global instance', function () {
      const rrc = new RouterRepositoryContext();
      RouterRepositoryContext.setGlobalInstance(rrc);
      const res = RouterRepositoryContext.getGlobalInstance();
      expect(res).to.be.eq(rrc);
    });
  });

  describe('hasGlobalInstance', function () {
    it('returns true if an instance registered or false', function () {
      const res1 = RouterRepositoryContext.hasGlobalInstance();
      expect(res1).to.be.false;
      new RouterRepositoryContext();
      const res2 = RouterRepositoryContext.hasGlobalInstance();
      expect(res2).to.be.true;
    });
  });

  describe('getGlobalInstance', function () {
    it('throws an error if no registered instance', function () {
      const throwable = () => RouterRepositoryContext.getGlobalInstance();
      expect(throwable).to.throw(
        Error,
        'The RouterRepositoryContext class has no registered global instance.',
      );
    });

    it('returns an instance registered by constructor', function () {
      const rrc = new RouterRepositoryContext();
      const res = RouterRepositoryContext.getGlobalInstance();
      expect(res).to.be.eq(rrc);
    });

    it('returns an instance registered by .setGlobalInstance()', function () {
      new RouterRepositoryContext();
      const rrc = new RouterRepositoryContext();
      new RouterRepositoryContext();
      RouterRepositoryContext.setGlobalInstance(rrc);
      const res = RouterRepositoryContext.getGlobalInstance();
      expect(res).to.be.eq(rrc);
    });
  });

  describe('removeGlobalInstance', function () {
    it('does nothing if no registered instance', function () {
      const res1 = RouterRepositoryContext.hasGlobalInstance();
      expect(res1).to.be.false;
      RouterRepositoryContext.removeGlobalInstance();
      const res2 = RouterRepositoryContext.hasGlobalInstance();
      expect(res2).to.be.false;
    });

    it('removes an instance that registered by constructor', function () {
      const rrc = new RouterRepositoryContext();
      const res1 = RouterRepositoryContext.getGlobalInstance();
      expect(res1).to.be.eq(rrc);
      RouterRepositoryContext.removeGlobalInstance();
      const res2 = RouterRepositoryContext.hasGlobalInstance();
      expect(res2).to.be.false;
    });

    it('removes an instance that registered by .setGlobalInstance()', function () {
      const rrc = new RouterRepositoryContext();
      RouterRepositoryContext.setGlobalInstance(rrc);
      const res1 = RouterRepositoryContext.getGlobalInstance();
      expect(res1).to.be.eq(rrc);
      RouterRepositoryContext.removeGlobalInstance();
      const res2 = RouterRepositoryContext.hasGlobalInstance();
      expect(res2).to.be.false;
    });
  });
});
