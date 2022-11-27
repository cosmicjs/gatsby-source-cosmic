import { createCosmicFetch } from '../fetchObjectHelpers';

class MockBucketObjects {
  constructor(called) {
    this.called = called;
  }

  find = jest.fn(() => {
    this.called.find = true;
    return this;
  });

  props = jest.fn(() => {
    this.called.props = true;
    return this;
  });

  limit = jest.fn(() => {
    this.called.limit = true;
    return this;
  });

  depth = jest.fn(() => {
    this.called.depth = true;
    return this;
  });

  useCache = jest.fn(() => {
    this.called.useCache = true;
    return this;
  });

  sort = jest.fn(() => {
    this.called.sort = true;
    return this;
  });

  status = jest.fn(() => {
    this.called.status = true;
    return this;
  });

  skip = jest.fn(() => {
    this.called.skip = true;
    return this;
  });
}

describe('createCosmicFetch', () => {
  it('should return a curried function', () => {
    const bucket = {};
    const objectType = { slug: 'posts' };

    const result = createCosmicFetch(objectType, bucket);

    expect(result).toBeInstanceOf(Function);
    expect(result(0)).toBeInstanceOf(Promise);
  });

  // find
  it('should call find with the object type', async () => {
    const bucket = {
      objects: new MockBucketObjects({}),
    };
    const objectType = { slug: 'posts' };

    await createCosmicFetch(objectType, bucket)(0);

    expect(bucket.objects.find).toHaveBeenCalledWith({ type: 'posts' });
  });

  // query
  it('should call find with the query from the object config', async () => {
    const bucket = { objects: new MockBucketObjects({}) };
    const objectType = { slug: 'posts', query: { title: 'test' } };

    await createCosmicFetch(objectType, bucket)(0);

    expect(bucket.objects.find).toHaveBeenCalledWith({
      type: 'posts',
      title: 'test',
    });
  });

  // props
  it('should call props with the props from the object config', async () => {
    const bucket = { objects: new MockBucketObjects({}) };
    const objectType = { slug: 'posts', props: 'test' };

    await createCosmicFetch(objectType, bucket)(0);

    expect(bucket.objects.find).toHaveBeenCalledWith({ type: 'posts' });
    expect(bucket.objects.props).toHaveBeenCalledWith('test');
  });

  // limit
  it('should call limit with the limit from the object config', async () => {
    const bucket = { objects: new MockBucketObjects({}) };
    const objectType = { slug: 'posts', limit: 10 };

    await createCosmicFetch(objectType, bucket)(0);

    expect(bucket.objects.find).toHaveBeenCalledWith({ type: 'posts' });
    expect(bucket.objects.limit).toHaveBeenCalledWith(10);
  });

  it('should not call limit with a limit less than 1', async () => {
    const bucket = { objects: new MockBucketObjects({}) };
    const objectType = { slug: 'posts', limit: 0 };

    await createCosmicFetch(objectType, bucket)(0);

    expect(bucket.objects.find).toHaveBeenCalledWith({ type: 'posts' });
    expect(bucket.objects.limit).not.toHaveBeenCalled();
  });

  // depth
  it('should call depth with the depth from the object config', async () => {
    const bucket = { objects: new MockBucketObjects({}) };
    const objectType = { slug: 'posts', depth: 1 };

    await createCosmicFetch(objectType, bucket)(0);

    expect(bucket.objects.find).toHaveBeenCalledWith({ type: 'posts' });
    expect(bucket.objects.depth).toHaveBeenCalledWith(1);
  });

  it('should call depth with a value of 0', async () => {
    const bucket = { objects: new MockBucketObjects({}) };
    const objectType = { slug: 'posts', depth: 0 };

    await createCosmicFetch(objectType, bucket)(0);

    expect(bucket.objects.find).toHaveBeenCalledWith({ type: 'posts' });
    expect(bucket.objects.depth).toHaveBeenCalledWith(0);
  });

  // useCache
  it('should call useCache with the use_cache from the object config', async () => {
    const bucket = { objects: new MockBucketObjects({}) };
    const objectType = { slug: 'posts', use_cache: true };

    await createCosmicFetch(objectType, bucket)(0);

    expect(bucket.objects.find).toHaveBeenCalledWith({ type: 'posts' });
    expect(bucket.objects.useCache).toHaveBeenCalledWith(true);
  });

  it('should call useCache with a value of false', async () => {
    const bucket = { objects: new MockBucketObjects({}) };
    const objectType = { slug: 'posts', use_cache: false };

    await createCosmicFetch(objectType, bucket)(0);

    expect(bucket.objects.find).toHaveBeenCalledWith({ type: 'posts' });
    expect(bucket.objects.useCache).toHaveBeenCalledWith(false);
  });

  // sort
  it('should call sort with the sort from the object config', async () => {
    const bucket = { objects: new MockBucketObjects({}) };
    const objectType = { slug: 'posts', sort: 'test' };

    await createCosmicFetch(objectType, bucket)(0);

    expect(bucket.objects.find).toHaveBeenCalledWith({ type: 'posts' });
    expect(bucket.objects.sort).toHaveBeenCalledWith('test');
  });

  // status
  it('should call status with the status from the object config', async () => {
    const bucket = { objects: new MockBucketObjects({}) };
    const objectType = { slug: 'posts', status: 'test' };

    await createCosmicFetch(objectType, bucket)(0);

    expect(bucket.objects.find).toHaveBeenCalledWith({ type: 'posts' });
    expect(bucket.objects.status).toHaveBeenCalledWith('test');
  });

  // skip
  it('should call skip with the skip from the object config', async () => {
    const bucket = { objects: new MockBucketObjects({}) };
    const objectType = { slug: 'posts' };

    await createCosmicFetch(objectType, bucket)(10);

    expect(bucket.objects.find).toHaveBeenCalledWith({ type: 'posts' });
    expect(bucket.objects.skip).toHaveBeenCalledWith(10);
  });
});
