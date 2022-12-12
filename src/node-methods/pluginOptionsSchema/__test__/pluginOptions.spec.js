import { testPluginOptionsSchema } from 'gatsby-plugin-utils';
import pluginOptionsSchema from '../pluginOptionsSchema';
import * as External from '../externalValidator';

describe('pluginOptionsSchema', () => {
  describe('Full Schema Tests', () => {
    it('should validate correct options', async () => {
      jest.spyOn(External, 'default').mockResolvedValue({});
      const options = {
        bucketSlug: 'test-bucket',
        readKey: 'test-read-key',
        limit: 500,
        sort: 'created_at',
        depth: 2,
        status: 'published',
        objectTypes: [
          'posts',
          {
            slug: 'authors',
            limit: 100,
            props: 'id,slug,title,content',
          },
          { slug: 'tags', query: { prop: 'value' } },
          { slug: 'categories', sort: '-created_at' },
          { slug: 'pages', status: 'any' },
        ],
      };

      const { isValid, errors } = await testPluginOptionsSchema(pluginOptionsSchema, options);

      expect(isValid).toBe(true);
      expect(errors).toEqual([]);
      expect(External.default).toHaveBeenCalledTimes(1);
    });

    it('should fail if connection to Cosmic fails', async () => {
      jest.spyOn(External, 'default').mockRejectedValue({});
      const options = {
        bucketSlug: 'test-bucket',
        readKey: 'test-read-key',
        fail: true,
      };

      const { isValid } = await testPluginOptionsSchema(pluginOptionsSchema, options);

      expect(isValid).toBe(false);
      expect(External.default).toHaveBeenCalledTimes(1);
    });
  });
});
