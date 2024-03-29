/* eslint-disable camelcase */
// eslint-disable-next-line no-unused-vars
import externalValidator from '../externalValidator';

jest.mock('@cosmicjs/sdk', () => ({
  createBucketClient: jest.fn(({ readKey }) => ({
    objectTypes: {
      find: readKey === 'fail' ? jest.fn().mockRejectedValue({ status: 401, message: 'Unauthorized' })
        : jest.fn().mockResolvedValue({}),
    },
  })),
}));

describe('pluginOptionsSchema', () => {
  describe('externalValidator', () => {
    it('should not throw when connection test is successful', async () => {
      const options = {
        bucketSlug: 'fakeBucketSlug',
        readKey: 'fakeRead',
      };

      let error;

      try {
        await externalValidator(options);
      } catch (e) {
        error = e;
      }

      expect(error).toBeUndefined();
    });

    it('should throw error if connection fails', async () => {
      const options = {
        bucketSlug: 'fakeBucketSlug',
        readKey: 'fail',
      };

      let error;

      try {
        await externalValidator(options);
      } catch (e) {
        error = e;
      }

      expect(error).toBeDefined();
      expect(error.message).toEqual('There was an issue connecting to Cosmic.\nStatus Code: 401\nMessage: Unauthorized');
    });
  });
});
