import sourceNodes from '../sourceNodes';
import * as helpers from '../../../helpers';

describe('sourceNodes', () => {
  it('should create nodes for each object type', async () => {
    const mockFormatObjectTypes = jest.spyOn(helpers, 'formatObjectTypes');
    mockFormatObjectTypes.mockImplementation(() => Promise.resolve([]));

    const mockFetchObjects = jest.spyOn(helpers, 'fetchObjects');
    mockFetchObjects.mockImplementation(() => Promise.resolve([
      {
        slug: 'test',
        objects: [
          { id: 1 },
          { id: 2 },
        ],
      },
      {
        slug: 'test2',
        objects: [
          { id: 3 },
        ],
      },
    ]));

    const createNode = jest.fn();
    const createContentDigest = jest.fn();
    const options = {};
    const lifecycleFunctions = {
      actions: {
        createNode,
      },
      createContentDigest,
    };

    await sourceNodes(lifecycleFunctions, options);

    expect(createNode).toHaveBeenCalledTimes(3);
    expect(createNode).toHaveBeenCalledWith({
      id: 1,
      parent: null,
      children: [],
      internal: {
        type: 'CosmicjsTest',
        mediaType: 'text/html',
        content: JSON.stringify({ id: 1 }),
        contentDigest: undefined,
      },
    });
    expect(createNode).toHaveBeenCalledWith({
      id: 2,
      parent: null,
      children: [],
      internal: {
        type: 'CosmicjsTest',
        mediaType: 'text/html',
        content: JSON.stringify({ id: 2 }),
        contentDigest: undefined,
      },
    });
    expect(createNode).toHaveBeenCalledWith({
      id: 3,
      parent: null,
      children: [],
      internal: {
        type: 'CosmicjsTest2',
        mediaType: 'text/html',
        content: JSON.stringify({ id: 3 }),
        contentDigest: undefined,
      },
    });
  });
});
