/* eslint-disable camelcase */
import createTypeConfigs from '../createTypeConfigs';

describe('createTypeConfigs', () => {
  it('should return an array of config objects', () => {
    const objectTypes = ['posts', 'pages'];
    const limit = 10;

    const result = createTypeConfigs(objectTypes, { limit });

    expect(result).toBeInstanceOf(Array);
    expect(result[0]).toBeInstanceOf(Object);
    expect(result[1]).toBeInstanceOf(Object);
    expect(result[0].slug).toBe('posts');
  });

  it('should return valid configs with a mixed array of strings and objects', () => {
    const objectTypes = ['posts', { slug: 'pages', limit: 20 }];
    const limit = 10;

    const result = createTypeConfigs(objectTypes, { limit });

    expect(result).toEqual([
      { slug: 'posts', limit: 10 },
      { slug: 'pages', limit: 20 },
    ]);
  });

  // ----
  // Property: limit
  // ----
  it('should set the global limit on objects without a limit config', () => {
    const objectTypes = ['posts', 'pages'];
    const limit = 10;

    const result = createTypeConfigs(objectTypes, { limit });

    expect(result).toEqual([
      { slug: 'posts', limit: 10 },
      { slug: 'pages', limit: 10 },
    ]);
  });

  it('should allow an object to override the global limit', () => {
    const objectTypes = ['posts', { slug: 'pages', limit: 20 }];
    const limit = 10;

    const result = createTypeConfigs(objectTypes, { limit });

    expect(result).toEqual([
      { slug: 'posts', limit: 10 },
      { slug: 'pages', limit: 20 },
    ]);
  });

  // ----
  // Property: depth
  // ----
  it('should set the global depth on objects without a depth config', () => {
    const objectTypes = ['posts', 'pages'];
    const depth = 1;

    const result = createTypeConfigs(objectTypes, { depth });

    expect(result).toEqual([
      { slug: 'posts', depth: 1 },
      { slug: 'pages', depth: 1 },
    ]);
  });

  it('should allow an object to override the global depth', () => {
    const objectTypes = ['posts', { slug: 'pages', depth: 2 }];
    const depth = 1;

    const result = createTypeConfigs(objectTypes, { depth });

    expect(result).toEqual([
      { slug: 'posts', depth: 1 },
      { slug: 'pages', depth: 2 },
    ]);
  });

  // ----
  // Property: use_cache
  // ----
  it('should set the global use_cache on objects without a use_cache config', () => {
    const objectTypes = ['posts', 'pages'];
    const use_cache = false;

    const result = createTypeConfigs(objectTypes, { use_cache });

    expect(result).toEqual([
      { slug: 'posts', use_cache: false },
      { slug: 'pages', use_cache: false },
    ]);
  });

  it('should allow an object to override the global use_cache', () => {
    const objectTypes = ['posts', { slug: 'pages', use_cache: true }];
    const use_cache = false;

    const result = createTypeConfigs(objectTypes, { use_cache });

    expect(result).toEqual([
      { slug: 'posts', use_cache: false },
      { slug: 'pages', use_cache: true },
    ]);
  });

  // ----
  // Property: sort
  // ----
  it('should set the global sort on objects without a sort config', () => {
    const objectTypes = ['posts', 'pages'];
    const sort = 'created_at';

    const result = createTypeConfigs(objectTypes, { sort });

    expect(result).toEqual([
      { slug: 'posts', sort: 'created_at' },
      { slug: 'pages', sort: 'created_at' },
    ]);
  });

  it('should allow an object to override the global sort', () => {
    const objectTypes = ['posts', { slug: 'pages', sort: '-created_at' }];
    const sort = 'created_at';

    const result = createTypeConfigs(objectTypes, { sort });

    expect(result).toEqual([
      { slug: 'posts', sort: 'created_at' },
      { slug: 'pages', sort: '-created_at' },
    ]);
  });

  // ----
  // Property: status
  // ----
  it('should set the global status on objects without a status config', () => {
    const objectTypes = ['posts', 'pages'];
    const status = 'published';

    const result = createTypeConfigs(objectTypes, { status });

    expect(result).toEqual([
      { slug: 'posts', status: 'published' },
      { slug: 'pages', status: 'published' },
    ]);
  });

  it('should allow an object to override the global status', () => {
    const objectTypes = ['posts', { slug: 'pages', status: 'draft' }];
    const status = 'published';

    const result = createTypeConfigs(objectTypes, { status });

    expect(result).toEqual([
      { slug: 'posts', status: 'published' },
      { slug: 'pages', status: 'draft' },
    ]);
  });
});
