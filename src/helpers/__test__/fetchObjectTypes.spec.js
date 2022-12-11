import fetchObjectTypes from '../fetchObjectTypes';

describe('fetchObjectTypes', () => {
  it('should return an array of object types', async () => {
    const bucket = {
      getObjectTypes: jest.fn().mockReturnValue({ object_types: [{ slug: 'posts' }, { slug: 'pages' }] }),
    };

    const result = await fetchObjectTypes(bucket);

    expect(result).toBeInstanceOf(Array);
    expect(result[0]).toBeInstanceOf(Object);
    expect(result[1]).toBeInstanceOf(Object);
    expect(result[0].slug).toBe('posts');
  });
});
