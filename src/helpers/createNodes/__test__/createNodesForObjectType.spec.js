import createNodesForObjectType from '../createNodesForObjectType';

describe('createNodesForObjectType', () => {
  it('should create nodes for an object type', () => {
    const createContentDigest = jest.fn();
    const createNode = jest.fn();
    const objectType = {
      slug: 'test-slug',
      objects: [
        {
          id: '123',
          title: 'Test Object',
        },
        {
          id: '456',
          title: 'Test Object 2',
        },
      ],
    };

    createNodesForObjectType({ createContentDigest, actions: { createNode } }, objectType);

    expect(createContentDigest).toHaveBeenCalledTimes(2);
    expect(createNode).toHaveBeenCalledTimes(2);
  });
});
