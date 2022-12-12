import { testPluginOptionsSchema } from 'gatsby-plugin-utils';
import pluginOptionsSchema from '../pluginOptionsSchema';
import * as External from '../externalValidator';

describe('pluginOptionsSchema', () => {
  describe('Object Level Schema Options', () => {
    // mock the external function to prevent it from calling cosmic
    jest.spyOn(External, 'default').mockResolvedValue({});

    it('should require objectType objects to contain a slug', async () => {
      const options = {
        bucketSlug: 'fakeBucketSlug',
        readKey: 'fakeReadKey',
        objectTypes: ['test', {}],
      };

      const { isValid, errors } = await testPluginOptionsSchema(pluginOptionsSchema, options);

      expect(isValid).toBe(false);
      expect(errors).toEqual(['"objectTypes[1].slug" is required']);
    });

    it('should not allow objectType slugs to be empty', async () => {
      const options = {
        bucketSlug: 'fakeBucketSlug',
        readKey: 'fakeReadKey',
        objectTypes: ['test', { slug: '' }],
      };

      const { isValid, errors } = await testPluginOptionsSchema(pluginOptionsSchema, options);

      expect(isValid).toBe(false);
      expect(errors).toEqual(['"objectTypes[1].slug" is not allowed to be empty']);
    });

    it('should not allow objectType queries to contain type slugs', async () => {
      const options = {
        bucketSlug: 'fakeBucketSlug',
        readKey: 'fakeReadKey',
        objectTypes: ['test', { slug: 'test', query: { type: 'test' } }],
      };

      const { isValid, errors } = await testPluginOptionsSchema(pluginOptionsSchema, options);

      expect(isValid).toBe(false);
      expect(errors).toEqual(['"objectTypes[1].query.type" is not allowed']);
    });

    it('should require objectType limit to be a number', async () => {
      const options = {
        bucketSlug: 'fakeBucketSlug',
        readKey: 'fakeReadKey',
        objectTypes: ['test', { slug: 'test', limit: 'test' }],
      };

      const { isValid, errors } = await testPluginOptionsSchema(pluginOptionsSchema, options);

      expect(isValid).toBe(false);
      expect(errors).toEqual(['"objectTypes[1].limit" must be a number']);
    });

    it('should require objectType limit to be greater than 0', async () => {
      const options = {
        bucketSlug: 'fakeBucketSlug',
        readKey: 'fakeReadKey',
        objectTypes: ['test', { slug: 'test', limit: 0 }],
      };

      const { isValid, errors } = await testPluginOptionsSchema(pluginOptionsSchema, options);

      expect(isValid).toBe(false);
      expect(errors).toEqual(['"objectTypes[1].limit" must be greater than or equal to 1']);
    });

    it('should require objectType limit to be an integer', async () => {
      const options = {
        bucketSlug: 'fakeBucketSlug',
        readKey: 'fakeReadKey',
        objectTypes: ['test', { slug: 'test', limit: 1.1 }],
      };

      const { isValid, errors } = await testPluginOptionsSchema(pluginOptionsSchema, options);

      expect(isValid).toBe(false);
      expect(errors).toEqual(['"objectTypes[1].limit" must be an integer']);
    });

    it('should require objectType props to be a string', async () => {
      const options = {
        bucketSlug: 'fakeBucketSlug',
        readKey: 'fakeReadKey',
        objectTypes: ['test', { slug: 'test', props: 1 }],
      };

      const { isValid, errors } = await testPluginOptionsSchema(pluginOptionsSchema, options);

      expect(isValid).toBe(false);
      expect(errors).toEqual(['"objectTypes[1].props" must be a string']);
    });

    it('should not allow objectType props to be empty', async () => {
      const options = {
        bucketSlug: 'fakeBucketSlug',
        readKey: 'fakeReadKey',
        objectTypes: ['test', { slug: 'test', props: '' }],
      };

      const { isValid, errors } = await testPluginOptionsSchema(pluginOptionsSchema, options);

      expect(isValid).toBe(false);
      expect(errors).toEqual(['"objectTypes[1].props" is not allowed to be empty']);
    });

    it('should require objectType props to include an id', async () => {
      const options = {
        bucketSlug: 'fakeBucketSlug',
        readKey: 'fakeReadKey',
        objectTypes: ['test', { slug: 'test', props: 'title' }],
      };

      const { isValid, errors } = await testPluginOptionsSchema(pluginOptionsSchema, options);

      expect(isValid).toBe(false);
      expect(errors).toEqual(['"objectTypes[1].props" failed custom validation because props must include "id".']);
    });

    it('should require objectType query to be an object', async () => {
      const options = {
        bucketSlug: 'fakeBucketSlug',
        readKey: 'fakeReadKey',
        objectTypes: ['test', { slug: 'test', query: 'test' }],
      };

      const { isValid, errors } = await testPluginOptionsSchema(pluginOptionsSchema, options);

      expect(isValid).toBe(false);
      expect(errors).toEqual(['"objectTypes[1].query" must be of type object']);
    });

    it('should require objectType sort to be a valid sort option', async () => {
      const options = {
        bucketSlug: 'fakeBucketSlug',
        readKey: 'fakeReadKey',
        objectTypes: ['test', { slug: 'test', sort: 'test' }],
      };

      const { isValid, errors } = await testPluginOptionsSchema(pluginOptionsSchema, options);

      expect(isValid).toBe(false);
      expect(errors).toEqual(['"objectTypes[1].sort" must be one of [created_at, -created_at, modified_at, -modified_at, random, order]']);
    });

    it('should require objectType status to be a valid status option', async () => {
      const options = {
        bucketSlug: 'fakeBucketSlug',
        readKey: 'fakeReadKey',
        objectTypes: ['test', { slug: 'test', status: 'test' }],
      };

      const { isValid, errors } = await testPluginOptionsSchema(pluginOptionsSchema, options);

      expect(isValid).toBe(false);
      expect(errors).toEqual(['"objectTypes[1].status" must be one of [published, any]']);
    });

    it('should require objectType depth to be a number', async () => {
      const options = {
        bucketSlug: 'fakeBucketSlug',
        readKey: 'fakeReadKey',
        objectTypes: ['test', { slug: 'test', depth: 'test' }],
      };

      const { isValid, errors } = await testPluginOptionsSchema(pluginOptionsSchema, options);

      expect(isValid).toBe(false);
      expect(errors).toEqual(['"objectTypes[1].depth" must be a number']);
    });

    it('should require objectType depth to be greater than or equal to 0', async () => {
      const options = {
        bucketSlug: 'fakeBucketSlug',
        readKey: 'fakeReadKey',
        objectTypes: ['test', { slug: 'test', depth: -1 }],
      };

      const { isValid, errors } = await testPluginOptionsSchema(pluginOptionsSchema, options);

      expect(isValid).toBe(false);
      expect(errors).toEqual(['"objectTypes[1].depth" must be greater than or equal to 0']);
    });

    it('should require objectType use_cache to be a boolean', async () => {
      const options = {
        bucketSlug: 'fakeBucketSlug',
        readKey: 'fakeReadKey',
        objectTypes: ['test', { slug: 'test', use_cache: 'test' }],
      };

      const { isValid, errors } = await testPluginOptionsSchema(pluginOptionsSchema, options);

      expect(isValid).toBe(false);
      expect(errors).toEqual(['"objectTypes[1].use_cache" must be a boolean']);
    });
  });
});
