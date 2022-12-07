import { handleCosmicError } from '../fetchObjectHelpers';

describe('handleCosmicError', () => {
  const reporter = {
    warn: jest.fn(),
    panic: jest.fn(),
  };

  it('should warn if the error is for a bad query', () => {
    const error = {
      status: 404,
      message: 'No objects found for your query',
    };
    const objectType = {
      slug: 'test',
    };

    handleCosmicError(error, reporter, objectType);

    expect(reporter.warn).toHaveBeenCalledTimes(1);
    expect(reporter.panic).toHaveBeenCalledTimes(0);
  });

  it('should panic for all other errors', () => {
    const error = {
      status: 500,
      message: 'Internal Server Error',
    };
    const objectType = {
      slug: 'test',
    };

    handleCosmicError(error, reporter, objectType);

    expect(reporter.warn).toHaveBeenCalledTimes(0);
    expect(reporter.panic).toHaveBeenCalledTimes(1);
  });
});
