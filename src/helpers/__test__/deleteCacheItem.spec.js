import deleteCacheItem from '../deleteCacheItem';

describe('deleteCacheItem', () => {
  it('should call the cache with the correct key', async () => {
    const cache = {
      del: jest.fn(),
    };
    const nodeAPIHelpers = {
      cache,
    };

    await deleteCacheItem(nodeAPIHelpers, { bucketSlug: 'test' }, 'test');

    expect(cache.del).toBeCalledWith('test-test-test');
  });
});
