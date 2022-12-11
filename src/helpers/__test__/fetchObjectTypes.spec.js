import fetchObjectTypes from '../fetchObjectTypes';

describe('fetchObjectTypes', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...OLD_ENV,
      GATSBY_WORKER_ID: '1',
    };
  });

  it('should return an array of object types', async () => {
    const nodeAPIHelpers = {
      cache: {
        get: jest.fn().mockReturnValue(undefined),
        set: jest.fn(),
      },
    };
    const options = {
      bucketSlug: 'test',
    };
    const bucket = {
      getObjectTypes: jest.fn().mockReturnValue({ object_types: [{ slug: 'posts' }, { slug: 'pages' }] }),
    };

    const result = await fetchObjectTypes(nodeAPIHelpers, options, bucket);

    expect(result).toBeInstanceOf(Array);
    expect(result[0]).toBeInstanceOf(Object);
    expect(result[1]).toBeInstanceOf(Object);
    expect(result[0].slug).toBe('posts');
  });

  it('should return an array of object types from the cache', async () => {
    const nodeAPIHelpers = {
      cache: {
        get: jest.fn().mockReturnValue([{ slug: 'cache-posts' }, { slug: 'cache-pages' }]),
      },
    };
    const options = {
      bucketSlug: 'test',
    };
    const bucket = {
      getObjectTypes: jest.fn().mockReturnValue({ object_types: [{ slug: 'posts' }, { slug: 'pages' }] }),
    };

    const result = await fetchObjectTypes(nodeAPIHelpers, options, bucket);

    expect(result).toBeInstanceOf(Array);
    expect(result[0]).toBeInstanceOf(Object);
    expect(result[1]).toBeInstanceOf(Object);
    expect(result[0].slug).toBe('cache-posts');
  });

  it('should set the cache when objects are fetched', async () => {
    const nodeAPIHelpers = {
      cache: {
        get: jest.fn().mockReturnValue(undefined),
        set: jest.fn(),
      },
    };
    const options = {
      bucketSlug: 'test',
    };
    const bucket = {
      getObjectTypes: jest.fn().mockReturnValue({ object_types: [{ slug: 'posts' }, { slug: 'pages' }] }),
    };

    await fetchObjectTypes(nodeAPIHelpers, options, bucket);

    expect(nodeAPIHelpers.cache.set).toBeCalled();
  });

  it('should get objects from the cache on the second call', async () => {
    const nodeAPIHelpers = {
      cache: {
        get: jest.fn()
          .mockReturnValueOnce(undefined)
          .mockReturnValueOnce([{ slug: 'cache-posts' }, { slug: 'cache-pages' }]),
        set: jest.fn(),
      },
    };
    const options = {
      bucketSlug: 'test',
    };
    const bucket = {
      getObjectTypes: jest.fn().mockReturnValue({ object_types: [{ slug: 'posts' }, { slug: 'pages' }] }),
    };

    await fetchObjectTypes(nodeAPIHelpers, options, bucket);
    const results = await fetchObjectTypes(nodeAPIHelpers, options, bucket);

    expect(nodeAPIHelpers.cache.get).toBeCalledTimes(2);
    expect(nodeAPIHelpers.cache.set).toBeCalledTimes(1);
    expect(results[0].slug).toBe('cache-posts');
  });

  it('should not attempt to get objects from the cache without a worker id', async () => {
    process.env = {
      ...OLD_ENV,
      GATSBY_WORKER_ID: undefined,
    };

    const nodeAPIHelpers = {
      cache: {
        get: jest.fn().mockReturnValue(undefined),
        set: jest.fn(),
      },
    };
    const options = {
      bucketSlug: 'test',
    };
    const bucket = {
      getObjectTypes: jest.fn().mockReturnValue({ object_types: [{ slug: 'posts' }, { slug: 'pages' }] }),
    };

    await fetchObjectTypes(nodeAPIHelpers, options, bucket);

    expect(nodeAPIHelpers.cache.get).not.toBeCalled();
  });

  it('should not attempt to set objects in the cache without a worker id', async () => {
    process.env = {
      ...OLD_ENV,
      GATSBY_WORKER_ID: undefined,
    };

    const nodeAPIHelpers = {
      cache: {
        get: jest.fn().mockReturnValue(undefined),
        set: jest.fn(),
      },
    };
    const options = {
      bucketSlug: 'test',
    };
    const bucket = {
      getObjectTypes: jest.fn().mockReturnValue({ object_types: [{ slug: 'posts' }, { slug: 'pages' }] }),
    };

    await fetchObjectTypes(nodeAPIHelpers, options, bucket);

    expect(nodeAPIHelpers.cache.set).not.toBeCalled();
  });
});
