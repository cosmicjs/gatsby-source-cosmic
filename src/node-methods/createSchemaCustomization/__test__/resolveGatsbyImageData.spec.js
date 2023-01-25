import * as probe from 'probe-image-size';
import * as gatsbyPluginImage from 'gatsby-plugin-image';
import * as getBase64Image from '../getBase64Image';
import * as DomColor from '../getDominantColor';
import * as generateImageSource from '../generateImageSource';
import resolveGatsbyImageData from '../resolveGatsbyImageData';

jest.mock('probe-image-size');
jest.mock('gatsby-plugin-image');

describe('resolveGatsbyImageData', () => {
  const reporter = {
    warn: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return null if no image is provided', async () => {
    const image = null;

    const result = await resolveGatsbyImageData(image, {}, {}, {}, { reporter });

    expect(result).toEqual(null);
    expect(reporter.warn).toHaveBeenCalled();
  });

  it('should probe the image for size', async () => {
    const image = { imgix_url: 'https://imgix.cosmicjs.com/test.jpg' };
    const probeMock = probe.mockImplementation(() => ({ width: 100, height: 100 }));
    const generateImageDataMock = gatsbyPluginImage
      .generateImageData.mockImplementation((value) => value);

    const result = await resolveGatsbyImageData(image, {}, {}, {}, { reporter });

    expect(probeMock).toHaveBeenCalledWith(image.imgix_url);
    expect(generateImageDataMock).toHaveBeenCalled();
    expect(result).toEqual(expect.objectContaining({ sourceMetadata: { format: 'jpeg', width: 100, height: 100 } }));
  });

  it('should include the image format in the sourceMetadata', async () => {
    const image = { imgix_url: 'https://imgix.cosmicjs.com/test.png' };
    probe.mockImplementation(() => ({ width: 100, height: 100 }));
    gatsbyPluginImage.generateImageData.mockImplementation((value) => value);

    const result = await resolveGatsbyImageData(image, {}, {}, {}, { reporter });

    expect(result.sourceMetadata.format).toEqual('png');
  });

  it('should warn once if a traced svg is requested', async () => {
    const image = { imgix_url: 'https://imgix.cosmicjs.com/test.jpg' };
    probe.mockImplementation(() => ({ width: 100, height: 100 }));
    gatsbyPluginImage.generateImageData.mockImplementation((value) => value);
    const getDominantColorMock = jest.spyOn(DomColor, 'default').mockImplementation(() => ({ src: 'test.jpg' }));

    await resolveGatsbyImageData(image, { placeholder: 'tracedSVG' }, {}, {}, { reporter });
    await resolveGatsbyImageData(image, { placeholder: 'tracedSVG' }, {}, {}, { reporter });

    expect(reporter.warn).toHaveBeenCalledTimes(1);
    expect(getDominantColorMock).toHaveBeenCalledTimes(2);
  });

  it('should call base64 image if a blurred placeholder is requested', async () => {
    const image = { imgix_url: 'https://imgix.cosmicjs.com/test.jpg' };
    probe.mockImplementation(() => ({ width: 100, height: 100 }));
    gatsbyPluginImage.generateImageData.mockImplementation((value) => value);
    const getBase64ImageMock = jest.spyOn(getBase64Image, 'default').mockImplementation(() => ({ src: 'test.jpg' }));

    await resolveGatsbyImageData(image, { placeholder: 'blurred' }, {}, {}, { reporter });

    expect(getBase64ImageMock).toHaveBeenCalled();
  });

  it('should call for dominant color if a dominantColor placeholder is requested', async () => {
    const image = { imgix_url: 'https://imgix.cosmicjs.com/test.jpg' };
    probe.mockImplementation(() => ({ width: 100, height: 100 }));
    gatsbyPluginImage.generateImageData.mockImplementation((value) => value);
    const getDominantColorMock = jest.spyOn(DomColor, 'default').mockImplementation(() => ({ src: 'test.jpg' }));

    await resolveGatsbyImageData(image, { placeholder: 'dominantColor' }, {}, {}, { reporter });

    expect(getDominantColorMock).toHaveBeenCalled();
  });

  it('should call generateImageData with correct args', async () => {
    const image = { imgix_url: 'https://imgix.cosmicjs.com/test.jpg' };
    probe.mockImplementation(() => ({ width: 100, height: 100 }));
    const generateImageDataMock = gatsbyPluginImage
      .generateImageData.mockImplementation((value) => value);
    const generateImageSourceMock = jest.spyOn(generateImageSource, 'default').mockImplementation(() => ({ src: 'test.jpg' }));

    await resolveGatsbyImageData(image, { placeholder: 'dominantColor' }, {}, {}, { reporter });

    expect(generateImageDataMock).toHaveBeenCalledWith(
      expect.objectContaining({
        backgroundColor: { src: 'test.jpg' },
        filename: 'https://imgix.cosmicjs.com/test.jpg',
        generateImageSource: generateImageSourceMock,
        options: { placeholder: 'dominantColor' },
        placeholder: 'dominantColor',
        pluginName: 'gatsby-source-cosmic',
        sourceMetadata: {
          format: 'jpeg',
          height: 100,
          width: 100,
        },
      }),
    );
  });
});
