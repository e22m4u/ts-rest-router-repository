import {expect} from 'chai';
import {DataType} from '@e22m4u/ts-data-schema';
import {convertDefaultsToOaDefaults} from './convert-defaults-to-oa-defaults.js';

describe('convertDefaultsToOaDefaults', function () {
  it('should convert the "default" to "oaDefault" in root', function () {
    const res = convertDefaultsToOaDefaults({
      type: DataType.STRING,
      default: 'value',
    });
    expect(res).to.be.eql({
      type: DataType.STRING,
      oaDefault: 'value',
    });
  });

  it('should convert the "default" to "oaDefault" in items', function () {
    const res = convertDefaultsToOaDefaults({
      type: DataType.ARRAY,
      items: {
        type: DataType.STRING,
        default: 'value',
      },
    });
    expect(res).to.be.eql({
      type: DataType.ARRAY,
      items: {
        type: DataType.STRING,
        oaDefault: 'value',
      },
    });
  });

  it('should convert the "default" to "oaDefault" in properties', function () {
    const res = convertDefaultsToOaDefaults({
      type: DataType.OBJECT,
      properties: {
        foo: {
          type: DataType.STRING,
          default: 'value',
        },
        bar: {
          type: DataType.NUMBER,
          default: 10,
        },
      },
    });
    expect(res).to.be.eql({
      type: DataType.OBJECT,
      properties: {
        foo: {
          type: DataType.STRING,
          oaDefault: 'value',
        },
        bar: {
          type: DataType.NUMBER,
          oaDefault: 10,
        },
      },
    });
  });

  it('should convert the "default" to "oaDefault" in properties with recursion', function () {
    const res = convertDefaultsToOaDefaults({
      type: DataType.OBJECT,
      properties: {
        foo: {
          type: DataType.OBJECT,
          properties: {
            bar: {
              type: DataType.OBJECT,
              properties: {
                baz: {
                  type: DataType.STRING,
                  default: 'value',
                },
                qux: {
                  type: DataType.ARRAY,
                  items: {
                    type: DataType.NUMBER,
                    default: 10,
                  },
                },
              },
              default: {
                baz: 'value',
                qux: [10],
              },
            },
          },
          default: {
            bar: {
              baz: 'value',
              qux: [10],
            },
          },
        },
      },
      default: {
        foo: {
          bar: {
            baz: 'value',
            qux: [10],
          },
        },
      },
    });
    expect(res).to.be.eql({
      type: DataType.OBJECT,
      properties: {
        foo: {
          type: DataType.OBJECT,
          properties: {
            bar: {
              type: DataType.OBJECT,
              properties: {
                baz: {
                  type: DataType.STRING,
                  oaDefault: 'value',
                },
                qux: {
                  type: DataType.ARRAY,
                  items: {
                    type: DataType.NUMBER,
                    oaDefault: 10,
                  },
                },
              },
              oaDefault: {
                baz: 'value',
                qux: [10],
              },
            },
          },
          oaDefault: {
            bar: {
              baz: 'value',
              qux: [10],
            },
          },
        },
      },
      oaDefault: {
        foo: {
          bar: {
            baz: 'value',
            qux: [10],
          },
        },
      },
    });
  });
});
