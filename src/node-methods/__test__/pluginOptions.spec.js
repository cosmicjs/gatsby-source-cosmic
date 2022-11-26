import { testPluginOptionsSchema } from 'gatsby-plugin-utils';
import pluginOptionsSchema from '../pluginOptionsSchema';

describe('pluginOptionsSchema', () => {
  it('should validate correct options', async () => {
    const options = {
      bucketSlug: 'test-bucket',
      readKey: 'test-read-key',
      limit: 500,
    };

    const { isValid, errors } = await testPluginOptionsSchema(pluginOptionsSchema, options);

    expect(isValid).toBe(true);
    expect(errors).toEqual([]);
  });

  it('should require bucketSlug', async () => {
    const options = {
      readKey: 'fakeReadKey',
    };

    const { isValid, errors } = await testPluginOptionsSchema(pluginOptionsSchema, options);

    expect(isValid).toBe(false);
    expect(errors).toEqual([
      '"bucketSlug" is required',
    ]);
  });

  it('should require readKey', async () => {
    const options = {
      bucketSlug: 'fakeBucketSlug',
    };

    const { isValid, errors } = await testPluginOptionsSchema(pluginOptionsSchema, options);

    expect(isValid).toBe(false);
    expect(errors).toEqual([
      '"readKey" is required',
    ]);
  });

  it('should require objectTypes to be an array', async () => {
    const options = {
      bucketSlug: 'fakeBucketSlug',
      readKey: 'fakeReadKey',
      objectTypes: 'fakeObjectType',
    };

    const { isValid, errors } = await testPluginOptionsSchema(pluginOptionsSchema, options);

    expect(isValid).toBe(false);
    expect(errors).toEqual([
      '"objectTypes" must be an array',
    ]);
  });

  it('should require objectTypes to be an array of strings or objects', async () => {
    const options = {
      bucketSlug: 'fakeBucketSlug',
      readKey: 'fakeReadKey',
      objectTypes: [123],
    };

    const { isValid, errors } = await testPluginOptionsSchema(pluginOptionsSchema, options);

    expect(isValid).toBe(false);
    expect(errors).toEqual([
      '"objectTypes[0]" does not match any of the allowed types',
    ]);
  });

  it('should require objectType objects to contain a slug', async () => {
    const options = {
      bucketSlug: 'fakeBucketSlug',
      readKey: 'fakeReadKey',
      objectTypes: [{}],
    };

    const { isValid, errors } = await testPluginOptionsSchema(pluginOptionsSchema, options);

    expect(isValid).toBe(false);
    expect(errors).toEqual([
      '"objectTypes[0]" does not match any of the allowed types',
    ]);
  });

  it('should require limit to be a number', async () => {
    const options = {
      bucketSlug: 'fakeBucketSlug',
      readKey: 'fakeReadKey',
      limit: 'fakeLimit',
    };

    const { isValid, errors } = await testPluginOptionsSchema(pluginOptionsSchema, options);

    expect(isValid).toBe(false);
    expect(errors).toEqual([
      '"limit" must be a number',
    ]);
  });

  it('should require a valid sort value', async () => {
    const options = {
      bucketSlug: 'fakeBucketSlug',
      readKey: 'fakeReadKey',
      sort: 'fakeSort',
    };

    const { isValid } = await testPluginOptionsSchema(pluginOptionsSchema, options);

    expect(isValid).toBe(false);
  });
});
