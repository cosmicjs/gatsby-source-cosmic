import createSchemaObjectForType from '../createSchemaObjectForType';

describe('createSchemaObjectForType', () => {
  it('Should return an array with correctly named root type', () => {
    const objectType = {
      slug: 'test-type',
      metafields: [],
    };

    const result = createSchemaObjectForType(objectType);

    expect(result).toEqual(expect.arrayContaining([
      expect.objectContaining({
        name: 'CosmicjsTestType',
      }),
    ]));
  });

  it('Should return an array with a node interface on the root type', () => {
    const objectType = {
      slug: 'test-type',
      metafields: [],
    };

    const result = createSchemaObjectForType(objectType);

    expect(result).toEqual(expect.arrayContaining([
      expect.objectContaining({
        interfaces: expect.arrayContaining(['Node']),
      }),
    ]));
  });

  it('Should it should have type inference on for the root type', () => {
    const objectType = {
      slug: 'test-type',
      metafields: [],
    };

    const result = createSchemaObjectForType(objectType);

    expect(result).toEqual(expect.arrayContaining([
      expect.objectContaining({
        extensions: expect.objectContaining({
          infer: true,
        }),
      }),
    ]));
  });

  it('Should add a type for unnested image types', () => {
    const objectType = {
      slug: 'test-type',
      metafields: [{
        key: 'image',
        type: 'file',
      }],
    };

    const result = createSchemaObjectForType(objectType);

    expect(result).toEqual(expect.arrayContaining([
      expect.objectContaining({
        name: 'CosmicjsTestTypeMetadata',
        fields: {
          image: 'CosmicjsImage',
        },
      }),
    ]));
  });

  it('should not add a type for unnested non-image type fields', () => {
    const objectType = {
      slug: 'test-type',
      metafields: [{
        key: 'text',
        type: 'text',
      }],
    };

    const result = createSchemaObjectForType(objectType);

    expect(result).toEqual(expect.arrayContaining([
      expect.objectContaining({
        name: 'CosmicjsTestTypeMetadata',
        fields: {},
      }),
    ]));
  });
  // TODO: Add tests for child values including parents & repeaters
});
