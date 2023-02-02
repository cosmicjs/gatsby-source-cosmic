import getCacheID from '../getCacheID';

describe('getCacheID', () => {
  it('should return a string', () => {
    const cacheID = getCacheID(
      { bucketSlug: 'test' },
      'test',
    );
    expect(typeof cacheID).toBe('string');
  });

  it('should return a string with the correct format', () => {
    const cacheID = getCacheID(
      { bucketSlug: 'slug' },
      'item',
    );

    expect(cacheID).toBe('item-test-slug');
  });
});
