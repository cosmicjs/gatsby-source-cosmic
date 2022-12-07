import formatObjectTypes from '../formatObjectTypes';
import * as Helpers from '../formatObjectTypeHelpers';

describe('formatObjectTypes', () => {
  const reporter = {
    warn: jest.fn(),
    panic: jest.fn(),
  };

  it('should return an array of valid object type configs', async () => {
    const mockFetchObjectTypes = jest.spyOn(Helpers, 'fetchObjectTypes').mockReturnValue([
      { slug: 'test1' },
      { slug: 'test2' },
      { slug: 'test3' },
    ]);

    const objectTypes = await formatObjectTypes(
      { reporter },
      {
        bucketSlug: 'test', readKey: 'test', objectTypes: ['test1', 'test2', 'test3'], limit: 100,
      },
    );

    expect(mockFetchObjectTypes).toHaveBeenCalledTimes(1);
    expect(reporter.warn).toHaveBeenCalledTimes(0);
    expect(reporter.panic).toHaveBeenCalledTimes(0);
    expect(objectTypes).toEqual([
      { slug: 'test1', limit: 100 },
      { slug: 'test2', limit: 100 },
      { slug: 'test3', limit: 100 },
    ]);
  });

  it('should return an array of valid object type configs when none are specified in the config', async () => {
    const mockFetchObjectTypes = jest.spyOn(Helpers, 'fetchObjectTypes').mockReturnValue([
      { slug: 'test1' },
      { slug: 'test2' },
      { slug: 'test3' },
    ]);

    const objectTypes = await formatObjectTypes(
      { reporter },
      {
        bucketSlug: 'test', readKey: 'test', objectTypes: [], limit: 100,
      },
    );

    expect(mockFetchObjectTypes).toHaveBeenCalledTimes(1);
    expect(reporter.warn).toHaveBeenCalledTimes(0);
    expect(reporter.panic).toHaveBeenCalledTimes(0);
    expect(objectTypes).toEqual([
      { slug: 'test1', limit: 100 },
      { slug: 'test2', limit: 100 },
      { slug: 'test3', limit: 100 },
    ]);
  });

  it('should return only the object types specified in the config', async () => {
    const mockFetchObjectTypes = jest.spyOn(Helpers, 'fetchObjectTypes').mockReturnValue([
      { slug: 'test1' },
      { slug: 'test2' },
      { slug: 'test3' },
    ]);

    const objectTypes = await formatObjectTypes(
      { reporter },
      {
        bucketSlug: 'test', readKey: 'test', objectTypes: ['test1', 'test3'], limit: 100,
      },
    );

    expect(mockFetchObjectTypes).toHaveBeenCalledTimes(1);
    expect(reporter.warn).toHaveBeenCalledTimes(0);
    expect(reporter.panic).toHaveBeenCalledTimes(0);
    expect(objectTypes).toEqual([
      { slug: 'test1', limit: 100 },
      { slug: 'test3', limit: 100 },
    ]);
  });

  it('should report a warning if an object type is specified in the config that does not exist', async () => {
    const mockFetchObjectTypes = jest.spyOn(Helpers, 'fetchObjectTypes').mockReturnValue([
      { slug: 'test1' },
      { slug: 'test2' },
      { slug: 'test3' },
    ]);

    const objectTypes = await formatObjectTypes(
      { reporter },
      {
        bucketSlug: 'test', readKey: 'test', objectTypes: ['test1', 'test4'], limit: 100,
      },
    );

    expect(mockFetchObjectTypes).toHaveBeenCalledTimes(1);
    expect(reporter.warn).toHaveBeenCalledTimes(1);
    expect(reporter.panic).toHaveBeenCalledTimes(0);
    expect(objectTypes).toEqual([
      { slug: 'test1', limit: 100 },
    ]);
  });

  it('should warn the developer of specific objects that do not exist', async () => {
    const mockFetchObjectTypes = jest.spyOn(Helpers, 'fetchObjectTypes').mockReturnValue([
      { slug: 'test1' },
      { slug: 'test2' },
      { slug: 'test3' },
    ]);

    await formatObjectTypes(
      { reporter },
      {
        bucketSlug: 'test', readKey: 'test', objectTypes: ['test1', 'test4', 'test5'], limit: 100,
      },
    );

    expect(mockFetchObjectTypes).toHaveBeenCalledTimes(1);
    expect(reporter.warn).toHaveBeenCalledTimes(1);
    expect(reporter.warn.mock.calls[0][0]).toContain('test4');
    expect(reporter.warn.mock.calls[0][0]).toContain('test5');
    expect(reporter.warn.mock.calls[0][0]).not.toContain('test1');
  });

  it('should panic if fetchObjectTypes throws an error', async () => {
    const mockFetchObjectTypes = jest.spyOn(Helpers, 'fetchObjectTypes').mockImplementation(() => {
      throw new Error('test');
    });

    const objectTypes = await formatObjectTypes(
      { reporter },
      {
        bucketSlug: 'test', readKey: 'test', objectTypes: ['test1', 'test2', 'test3'], limit: 100,
      },
    );

    expect(mockFetchObjectTypes).toHaveBeenCalledTimes(1);
    expect(reporter.warn).toHaveBeenCalledTimes(0);
    expect(reporter.panic).toHaveBeenCalledTimes(1);
    expect(objectTypes).toEqual([]);
  });
});
