import fetchObjects from '../fetchObjects';
import * as Helpers from '../fetchObjectHelpers';

describe('fetchObjects', () => {
  const reporter = {
    info: jest.fn(),
    warn: jest.fn(),
    panic: jest.fn(),
  };

  it('Should return fetched objects when there are less than the limit', async () => {
    const cosmicCallMock = jest.fn(() => Promise.resolve({
      total: 2,
      objects: [{ id: 1 }, { id: 2 }],
    }));
    const mockCreateCosmicFetch = jest.spyOn(Helpers, 'createCosmicFetch').mockReturnValue(cosmicCallMock);

    const fetchedObjects = await fetchObjects(
      { reporter },
      { bucketSlug: 'test', readKey: 'test', objectTypes: [{ slug: 'test', limit: 100 }] },
    );

    expect(mockCreateCosmicFetch).toHaveBeenCalledTimes(1);
    expect(cosmicCallMock).toHaveBeenCalledTimes(1);
    expect(cosmicCallMock).toHaveBeenCalledWith(0);
    expect(reporter.info).toHaveBeenCalledTimes(1);
    expect(reporter.panic).toHaveBeenCalledTimes(0);
    expect(fetchedObjects).toEqual([{ slug: 'test', limit: 100, objects: [{ id: 1 }, { id: 2 }] }]);
  });

  it('Should return fetched objects when there are more than the limit', async () => {
    const cosmicCallMock = jest.fn();
    cosmicCallMock
      .mockImplementationOnce(() => Promise.resolve({
        total: 2,
        objects: [{ id: 1 }],
      }))
      .mockImplementationOnce(() => Promise.resolve({
        total: 2,
        objects: [{ id: 2 }],
      }));
    const mockCreateCosmicFetch = jest.spyOn(Helpers, 'createCosmicFetch').mockReturnValue(cosmicCallMock);

    const fetchedObjects = await fetchObjects(
      { reporter },
      { bucketSlug: 'test', readKey: 'test', objectTypes: [{ slug: 'test', limit: 1 }] },
    );

    expect(mockCreateCosmicFetch).toHaveBeenCalledTimes(1);
    expect(cosmicCallMock).toHaveBeenCalledTimes(2);
    expect(reporter.info).toHaveBeenCalledTimes(1);
    expect(reporter.panic).toHaveBeenCalledTimes(0);
    expect(fetchedObjects).toEqual([{ slug: 'test', limit: 1, objects: [{ id: 1 }, { id: 2 }] }]);
  });

  it('should panic if a paginated request fails', async () => {
    const cosmicCallMock = jest.fn();
    cosmicCallMock
      .mockImplementationOnce(() => Promise.resolve({
        total: 2,
        objects: [{ id: 1 }],
      }))
      .mockImplementationOnce(() => Promise.reject(new Error({ message: 'test' })));
    const mockCreateCosmicFetch = jest.spyOn(Helpers, 'createCosmicFetch').mockReturnValue(cosmicCallMock);

    await fetchObjects(
      { reporter },
      { bucketSlug: 'test', readKey: 'test', objectTypes: [{ slug: 'test', limit: 1 }] },
    );

    expect(mockCreateCosmicFetch).toHaveBeenCalledTimes(1);
    expect(cosmicCallMock).toHaveBeenCalledTimes(2);
    expect(reporter.info).toHaveBeenCalledTimes(1);
    expect(reporter.panic).toHaveBeenCalledTimes(1);
  });

  it('should return fetched objects when there are more than the limit and multiple object types', async () => {
    const cosmicCallMock = jest.fn();
    cosmicCallMock
      .mockImplementationOnce(() => Promise.resolve({
        total: 2,
        objects: [{ id: 1 }],
      }))
      .mockImplementationOnce(() => Promise.resolve({
        total: 2,
        objects: [{ id: 2 }],
      }))
      .mockImplementationOnce(() => Promise.resolve({
        total: 2,
        objects: [{ id: 3 }],
      }))
      .mockImplementationOnce(() => Promise.resolve({
        total: 2,
        objects: [{ id: 4 }],
      }));
    const mockCreateCosmicFetch = jest.spyOn(Helpers, 'createCosmicFetch').mockReturnValue(cosmicCallMock);

    const fetchedObjects = await fetchObjects(
      { reporter },
      {
        bucketSlug: 'test',
        readKey: 'test',
        objectTypes: [
          { slug: 'test1', limit: 1 },
          { slug: 'test2', limit: 1 },
        ],
      },
    );

    expect(mockCreateCosmicFetch).toHaveBeenCalledTimes(2);
    expect(cosmicCallMock).toHaveBeenCalledTimes(4);
    expect(reporter.info).toHaveBeenCalledTimes(2);
    expect(reporter.panic).toHaveBeenCalledTimes(0);
    expect(fetchedObjects).toEqual([
      { slug: 'test1', limit: 1, objects: [{ id: 1 }, { id: 2 }] },
      { slug: 'test2', limit: 1, objects: [{ id: 3 }, { id: 4 }] },
    ]);
  });

  it('should call reporter.panic when there is an error', async () => {
    const cosmicCallMock = jest.fn(() => Promise.reject(new Error('test')));
    const mockCreateCosmicFetch = jest.spyOn(Helpers, 'createCosmicFetch').mockReturnValue(cosmicCallMock);

    await fetchObjects(
      { reporter },
      { bucketSlug: 'test', readKey: 'test', objectTypes: [{ slug: 'test', limit: 1 }] },
    );

    expect(mockCreateCosmicFetch).toHaveBeenCalledTimes(1);
    expect(cosmicCallMock).toHaveBeenCalledTimes(1);
    expect(cosmicCallMock).toHaveBeenCalledWith(0);
    expect(reporter.warn).toHaveBeenCalledTimes(1);
    expect(reporter.panic).toHaveBeenCalledTimes(1);
  });
});
