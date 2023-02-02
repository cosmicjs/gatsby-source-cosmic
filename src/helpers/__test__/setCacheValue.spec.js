import setCacheValue from '../setCacheValue';

describe('setCacheValue', () => {
  it('should call the cache with the correct key', async () => {
    const cache = {
      set: jest.fn(),
    };
    const nodeAPIHelpers = {
      cache,
    };

    await setCacheValue(nodeAPIHelpers, { bucketSlug: 'test' }, 'test', { foo: 'bar' });

    expect(cache.set).toBeCalledWith('test-test-test', { foo: 'bar' });
  });
});
