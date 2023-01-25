import * as axios from 'axios';
import getDominantColor, {
  fetchedDomColorImages,
} from '../getDominantColor';

jest.mock('axios');

describe('getDominantColor', () => {
  const reporter = {
    info: jest.fn(),
    warn: jest.fn(),
    panic: jest.fn(),
  };

  beforeEach(() => {
    axios.mockClear();
    delete fetchedDomColorImages['https://imgix.cosmicjs.com/image.jpg'];
  });

  it('should return a default color if no image is provided', async () => {
    const imageURL = null;

    const result = await getDominantColor(imageURL, { reporter });

    expect(result).toEqual('rgba(0,0,0,0.5)');
  });

  it('should return a default color if the image is not from imgix', async () => {
    const imageURL = 'https://test.com/image.jpg';

    const result = await getDominantColor(imageURL, { reporter });

    expect(result).toEqual('rgba(0,0,0,0.5)');
  });

  it('should attempt to get color from imgix', async () => {
    const imageURL = 'https://imgix.cosmicjs.com/image.jpg';
    const axiosMock = axios.get.mockImplementation(() => Promise.resolve({
      data: {
        dominant_colors: {
          vibrant_dark: {
            hex: '#94622d',
          },
        },
      },
    }));

    const result = await getDominantColor(imageURL, { reporter });

    expect(result).toEqual('#94622d');
    expect(axiosMock).toHaveBeenCalledWith(`${imageURL}&palette=json`);
  });

  it('should store a fetched color in the fetchedDomColorImages object', async () => {
    const imageURL = 'https://imgix.cosmicjs.com/image.jpg';
    axios.get.mockImplementation(() => Promise.resolve({
      data: {
        dominant_colors: {
          vibrant_dark: {
            hex: '#94622d',
          },
        },
      },
    }));

    await getDominantColor(imageURL, { reporter });

    expect(fetchedDomColorImages[imageURL]).toEqual('#94622d');
  });

  it('should retrieve a color from the fetchedDomColorImages object if it has already been fetched', async () => {
    const imageURL = 'https://imgix.cosmicjs.com/image.jpg';
    fetchedDomColorImages[imageURL] = '#94622d';

    const result = await getDominantColor(imageURL, { reporter });

    expect(result).toEqual('#94622d');
    expect(axios.get).not.toHaveBeenCalled();
  });

  it('should return a default color if imgix returns no dominant color', async () => {
    const imageURL = 'https://imgix.cosmicjs.com/image.jpg';
    const axiosMock = axios.get.mockImplementation(() => Promise.resolve({
      data: {
        dominant_colors: {},
      },
    }));

    const result = await getDominantColor(imageURL, { reporter });

    expect(result).toEqual('rgba(0,0,0,0.5)');
    expect(axiosMock).toHaveBeenCalledWith(`${imageURL}&palette=json`);
  });

  it('should return a default color if the axios promise rejects', async () => {
    const imageURL = 'https://imgix.cosmicjs.com/image.jpg';
    const axiosMock = axios.get.mockImplementation(() => Promise.reject());

    const result = await getDominantColor(imageURL, { reporter });

    expect(result).toEqual('rgba(0,0,0,0.5)');
    expect(axiosMock).toHaveBeenCalledWith(`${imageURL}&palette=json`);
  });

  it('should report a warning if imgix fails', async () => {
    const imageURL = 'https://imgix.cosmicjs.com/image.jpg';
    axios.get.mockImplementation(() => Promise.reject());

    await getDominantColor(imageURL, { reporter });

    expect(reporter.warn).toHaveBeenCalledWith(`Could not get dominant color from imgix for image: ${imageURL}`);
  });
});
