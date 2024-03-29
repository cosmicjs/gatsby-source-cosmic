import { getChildTypes } from '../createSchemaObjectForType';

describe('createSchemaObjectForType > getChildTypes', () => {
  it('should return an empty array if no fields are passed', () => {
    const fields = [];
    const typeSlug = 'TestTypeMetadata';

    const result = getChildTypes(fields, typeSlug);

    expect(result).toEqual([]);
  });

  it('should return an empty array if fields are not an array', () => {
    const fields = {};
    const typeSlug = 'TestTypeMetadata';

    const result = getChildTypes(fields, typeSlug);

    expect(result).toEqual([]);
  });

  it('should create types for unnested image fields', () => {
    const fields = [
      {
        key: 'image',
        type: 'file',
      },
    ];
    const typeSlug = 'TestTypeMetadata';
    const result = getChildTypes(fields, typeSlug);

    expect(result).toEqual([{
      name: 'TestTypeMetadata',
      fields: {
        image: 'CosmicjsImage',
      },
      extensions: {
        infer: true,
      },
    }]);
  });

  it('should create image types for fields nested in a parent', () => {
    const fields = [
      {
        key: 'test',
        type: 'parent',
        children: [
          {
            key: 'image',
            type: 'file',
          },
        ],
      },
    ];
    const typeSlug = 'TestTypeMetadata';
    const result = getChildTypes(fields, typeSlug);

    expect(result).toEqual(expect.arrayContaining([
      {
        name: 'TestTypeMetadata',
        fields: {
          test: 'TestTypeMetadataTest',
        },
        extensions: {
          infer: true,
        },
      },
      {
        name: 'TestTypeMetadataTest',
        fields: {
          image: 'CosmicjsImage',
        },
        extensions: {
          infer: true,
        },
      },
    ]));
  });

  it('should create image type for deeply nested parent fields', () => {
    const fields = [
      {
        key: 'test0',
        type: 'parent',
        children: [
          {
            key: 'test1',
            type: 'parent',
            children: [
              {
                key: 'image',
                type: 'file',
              },
            ],
          },
        ],
      },
    ];
    const typeSlug = 'TestTypeMetadata';
    const result = getChildTypes(fields, typeSlug);

    expect(result).toEqual(expect.arrayContaining([
      {
        name: 'TestTypeMetadata',
        fields: {
          test0: 'TestTypeMetadataTest0',
        },
        extensions: {
          infer: true,
        },
      },
      {
        name: 'TestTypeMetadataTest0',
        fields: {
          test1: 'TestTypeMetadataTest0Test1',
        },
        extensions: {
          infer: true,
        },
      },
      {
        name: 'TestTypeMetadataTest0Test1',
        fields: {
          image: 'CosmicjsImage',
        },
        extensions: {
          infer: true,
        },
      },
    ]));
  });

  it('should create image types for fields nested in a repeater', () => {
    const fields = [
      {
        key: 'test',
        type: 'repeater',
        repeater_fields: [
          {
            key: 'image',
            type: 'file',
          },
        ],
      },
    ];
    const typeSlug = 'TestTypeMetadata';
    const result = getChildTypes(fields, typeSlug);

    expect(result).toEqual(expect.arrayContaining([
      {
        name: 'TestTypeMetadata',
        fields: {
          test: '[TestTypeMetadataTestItems]',
        },
        extensions: {
          infer: true,
        },
      },
      {
        name: 'TestTypeMetadataTestItems',
        fields: {
          image: 'CosmicjsImage',
        },
        extensions: {
          infer: true,
        },
      },
    ]));
  });
});
