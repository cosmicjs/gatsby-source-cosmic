import { testPluginOptionsSchema } from 'gatsby-plugin-utils';
import { pluginOptionsSchema } from '../gatsby-node';

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

  it('should require objectTypes to be an array of strings', async () => {
    const options = {
      bucketSlug: 'fakeBucketSlug',
      readKey: 'fakeReadKey',
      objectTypes: [123],
    };

    const { isValid, errors } = await testPluginOptionsSchema(pluginOptionsSchema, options);

    expect(isValid).toBe(false);
    expect(errors).toEqual([
      '"objectTypes[0]" must be a string',
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
});
