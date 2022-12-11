import createNodesForObjectType from '../createNodesForObjectType';

describe('createNodesForObjectType', () => {
  it('should create nodes for an object type', () => {
    const createContentDigest = jest.fn();
    const createNode = jest.fn();
    const reporter = {
      panic: jest.fn(),
    };

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

    createNodesForObjectType({
      createContentDigest,
      actions: { createNode },
      reporter,
    }, objectType);

    expect(createContentDigest).toHaveBeenCalledTimes(2);
    expect(createNode).toHaveBeenCalledTimes(2);
    expect(reporter.panic).not.toHaveBeenCalled();
  });

  it('should panic if an object has no id', () => {
    const createContentDigest = jest.fn();
    const createNode = jest.fn();
    const reporter = {
      panic: jest.fn(),
    };

    const objectType = {
      slug: 'test-slug',
      objects: [
        {
          title: 'Test Object',
        },
      ],
    };

    createNodesForObjectType({
      createContentDigest,
      actions: { createNode },
      reporter,
    }, objectType);

    expect(createContentDigest).not.toHaveBeenCalled();
    expect(createNode).not.toHaveBeenCalled();
    expect(reporter.panic).toHaveBeenCalled();
  });
});
