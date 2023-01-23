import generateImageSource from '../generateImageSource';

describe('generateImageSource', () => {
  it('Should generate a source object with a src URL', () => {
    const baseURL = 'https://test.com/';

    const sourceObject = generateImageSource(baseURL);

    expect(sourceObject).toEqual({
      src: 'https://test.com/?',
    });
  });

  it('Should add width to the source object and src URL', () => {
    const baseURL = 'https://test.com/';
    const width = 100;

    const sourceObject = generateImageSource(baseURL, width);

    expect(sourceObject).toEqual({
      src: 'https://test.com/?w=100',
      width: 100,
    });
  });

  it('Should add height to the source object and src URL', () => {
    const baseURL = 'https://test.com/';
    const height = 100;

    const sourceObject = generateImageSource(baseURL, null, height);

    expect(sourceObject).toEqual({
      src: 'https://test.com/?h=100',
      height: 100,
    });
  });

  it('Should add format to the source object and src URL', () => {
    const baseURL = 'https://test.com/';
    const format = 'png';

    const sourceObject = generateImageSource(baseURL, null, null, format);

    expect(sourceObject).toEqual({
      src: 'https://test.com/?fm=png',
      format: 'png',
    });
  });

  it('Should add quality to the source object and src URL', () => {
    const baseURL = 'https://test.com/';
    const options = {
      quality: 50,
    };

    const sourceObject = generateImageSource(baseURL, null, null, null, null, options);

    expect(sourceObject).toEqual({
      src: 'https://test.com/?q=50',
      quality: 50,
    });
  });
});
