import attemptCacheRetrieve from '../attemptCacheRetrieve';

describe('attemptCacheRetrieve', () => {
  it('should return a cached item', async () => {
    const cache = {
      get: jest.fn().mockReturnValue({ foo: 'bar' }),
    };

    const result = await attemptCacheRetrieve({ cache }, { bucketSlug: 'test' }, 'test');

    expect(result).toBeInstanceOf(Object);
    expect(result.foo).toBe('bar');
  });

  it('should return undefined if no cached item is found', async () => {
    const cache = {
      get: jest.fn().mockReturnValue(undefined),
    };

    const result = await attemptCacheRetrieve({ cache }, { bucketSlug: 'test' }, 'test');

    expect(result).toBe(undefined);
  });

  it('should call the cache with the correct key', async () => {
    const cache = {
      get: jest.fn().mockReturnValue({ foo: 'bar' }),
    };

    await attemptCacheRetrieve({ cache }, { bucketSlug: 'test' }, 'test');

    expect(cache.get).toBeCalledWith('test-test-test');
  });
});
