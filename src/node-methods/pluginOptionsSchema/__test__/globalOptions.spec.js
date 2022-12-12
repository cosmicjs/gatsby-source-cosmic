import { testPluginOptionsSchema } from 'gatsby-plugin-utils';
import pluginOptionsSchema from '../pluginOptionsSchema';
import * as External from '../externalValidator';

describe('pluginOptionsSchema', () => {
  describe('Top Level Schema Options', () => {
    // mock the external function to prevent it from calling cosmic
    jest.spyOn(External, 'default').mockResolvedValue({});

    // ----
    // Property: bucketSlug
    // ----
    it('should require bucketSlug', async () => {
      const options = {
        readKey: 'fakeReadKey',
      };

      const { isValid, errors } = await testPluginOptionsSchema(pluginOptionsSchema, options);

      expect(isValid).toBe(false);
      expect(errors).toEqual(['"bucketSlug" is required']);
    });

    it('should not allow bucket slug to be empty', async () => {
      const options = {
        bucketSlug: '',
        readKey: 'fakeReadKey',
      };

      const { isValid, errors } = await testPluginOptionsSchema(pluginOptionsSchema, options);

      expect(isValid).toBe(false);
      expect(errors).toEqual(['"bucketSlug" is not allowed to be empty']);
    });

    // ----
    // Property: readKey
    // ----
    it('should require readKey', async () => {
      const options = {
        bucketSlug: 'fakeBucketSlug',
      };

      const { isValid, errors } = await testPluginOptionsSchema(pluginOptionsSchema, options);

      expect(isValid).toBe(false);
      expect(errors).toEqual(['"readKey" is required']);
    });

    it('should not allow read key to be empty', async () => {
      const options = {
        bucketSlug: 'fakeBucketSlug',
        readKey: '',
      };

      const { isValid, errors } = await testPluginOptionsSchema(pluginOptionsSchema, options);

      expect(isValid).toBe(false);
      expect(errors).toEqual(['"readKey" is not allowed to be empty']);
    });

    // ----
    // Property: limit (global)
    // ----
    it('should require the global limit to be a number', async () => {
      const options = {
        bucketSlug: 'fakeBucketSlug',
        readKey: 'fakeReadKey',
        limit: 'fakeLimit',
      };

      const { isValid, errors } = await testPluginOptionsSchema(pluginOptionsSchema, options);

      expect(isValid).toBe(false);
      expect(errors).toEqual(['"limit" must be a number']);
    });

    it('should require the global limit to be greater than 0', async () => {
      const options = {
        bucketSlug: 'fakeBucketSlug',
        readKey: 'fakeReadKey',
        limit: 0,
      };

      const { isValid, errors } = await testPluginOptionsSchema(pluginOptionsSchema, options);

      expect(isValid).toBe(false);
      expect(errors).toEqual(['"limit" must be greater than or equal to 1']);
    });

    it('should require the global limit to be an integer', async () => {
      const options = {
        bucketSlug: 'fakeBucketSlug',
        readKey: 'fakeReadKey',
        limit: 1.5,
      };

      const { isValid, errors } = await testPluginOptionsSchema(pluginOptionsSchema, options);

      expect(isValid).toBe(false);
      expect(errors).toEqual(['"limit" must be an integer']);
    });

    // ----
    // Property: depth (global)
    // ----
    it('should require the global depth to be a number', async () => {
      const options = {
        bucketSlug: 'fakeBucketSlug',
        readKey: 'fakeReadKey',
        depth: 'fakeDepth',
      };

      const { isValid, errors } = await testPluginOptionsSchema(pluginOptionsSchema, options);

      expect(isValid).toBe(false);
      expect(errors).toEqual(['"depth" must be a number']);
    });

    it('should require the global depth to be greater than or equal to 0', async () => {
      const options = {
        bucketSlug: 'fakeBucketSlug',
        readKey: 'fakeReadKey',
        depth: -1,
      };

      const { isValid, errors } = await testPluginOptionsSchema(pluginOptionsSchema, options);

      expect(isValid).toBe(false);
      expect(errors).toEqual(['"depth" must be greater than or equal to 0']);
    });
    // ----
    // Property: use_cache (global)
    // ----
    it('should require the global use_cache to be a boolean', async () => {
      const options = {
        bucketSlug: 'fakeBucketSlug',
        readKey: 'fakeReadKey',
        use_cache: 'fakeUseCache',
      };

      const { isValid, errors } = await testPluginOptionsSchema(pluginOptionsSchema, options);

      expect(isValid).toBe(false);
      expect(errors).toEqual(['"use_cache" must be a boolean']);
    });

    // ----
    // Property: sort (global)
    // ----
    it('should reject an invalid global sort value', async () => {
      const options = {
        bucketSlug: 'fakeBucketSlug',
        readKey: 'fakeReadKey',
        sort: 'fakeSort',
      };

      const { isValid, errors } = await testPluginOptionsSchema(pluginOptionsSchema, options);

      expect(isValid).toBe(false);
      expect(errors).toEqual(['"sort" must be one of [created_at, -created_at, modified_at, -modified_at, random, order]']);
    });

    // ----
    // Property: sort (global)
    // ----
    it('should reject an invalid global status value', async () => {
      const options = {
        bucketSlug: 'fakeBucketSlug',
        readKey: 'fakeReadKey',
        status: 'fakeStatus',
      };

      const { isValid, errors } = await testPluginOptionsSchema(pluginOptionsSchema, options);

      expect(isValid).toBe(false);
      expect(errors).toEqual(['"status" must be one of [published, any]']);
    });

    // ----
    // Property: objectTypes
    // ----
    it('should require objectTypes to be an array', async () => {
      const options = {
        bucketSlug: 'fakeBucketSlug',
        readKey: 'fakeReadKey',
        objectTypes: 'fakeObjectType',
      };

      const { isValid, errors } = await testPluginOptionsSchema(pluginOptionsSchema, options);

      expect(isValid).toBe(false);
      expect(errors).toEqual(['"objectTypes" must be an array']);
    });

    it('should allow objectTypes to be strings', async () => {
      const options = {
        bucketSlug: 'test-bucket',
        readKey: 'test-read-key',
        objectTypes: ['posts', 'authors'],
      };

      const { isValid } = await testPluginOptionsSchema(pluginOptionsSchema, options);

      expect(isValid).toBe(true);
    });

    it('should allow objectTypes to be objects', async () => {
      const options = {
        bucketSlug: 'test-bucket',
        readKey: 'test-read-key',
        objectTypes: [{ slug: 'posts' }, { slug: 'authors' }],
      };

      const { isValid } = await testPluginOptionsSchema(pluginOptionsSchema, options);

      expect(isValid).toBe(true);
    });

    it('should allow objectTypes to be a mix of strings and objects', async () => {
      const options = {
        bucketSlug: 'test-bucket',
        readKey: 'test-read',
        objectTypes: ['posts', { slug: 'authors' }],
      };

      const { isValid } = await testPluginOptionsSchema(pluginOptionsSchema, options);

      expect(isValid).toBe(true);
    });

    it('should reject objectTypes that are not strings or objects', async () => {
      const options = {
        bucketSlug: 'test-bucket',
        readKey: 'test-read',
        objectTypes: [1, 'posts'],
      };

      const { isValid, errors } = await testPluginOptionsSchema(pluginOptionsSchema, options);

      expect(isValid).toBe(false);
      expect(errors).toEqual(['"objectTypes[0]" must be one of [string, object]']);
    });

    it('should reject empty objectType strings', async () => {
      const options = {
        bucketSlug: 'test-bucket',
        readKey: 'test-read',
        objectTypes: ['', { slug: 'authors' }],
      };

      const { isValid, errors } = await testPluginOptionsSchema(pluginOptionsSchema, options);

      expect(isValid).toBe(false);
      expect(errors).toEqual(['"objectTypes[0]" is not allowed to be empty']);
    });
  });
});
