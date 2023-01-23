import * as axios from 'axios';
import * as gatsbyCoreUtils from 'gatsby-core-utils';
import * as pluginSharp from 'gatsby-plugin-sharp';
import getDominantColor, {
  fetchedDomColorImages,
  inProgressDomColorImages,
} from '../getDominantColor';

jest.mock('axios');
jest.mock('gatsby-core-utils');
jest.mock('gatsby-plugin-sharp');

describe('getDominantColor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a default color if no image is provided', async () => {
    const imageURL = null;

    const result = await getDominantColor(imageURL);

    expect(result).toEqual('rgba(0,0,0,0.5)');
  });

  it('should return a default color if the image is not from imgix', async () => {
    const imageURL = 'https://test.com/image.jpg';

    const result = await getDominantColor(imageURL);

    expect(result).toEqual('rgba(0,0,0,0.5)');
  });

  it('should attempt to get color from imgix', async () => {
    const imageURL = 'https://imgix.cosmicjs.com/image.jpg';
    const cacheMock = { directory: 'test' };
    const axiosMock = axios.get.mockImplementation(() => Promise.resolve({
      data: {
        dominant_colors: {
          vibrant_dark: {
            hex: '#000000',
          },
        },
      },
    }));

    const result = await getDominantColor(imageURL, cacheMock);

    expect(result).toEqual('#000000');
    expect(axiosMock).toHaveBeenCalledWith(`${imageURL}&palette=json`);
  });

  //  TODO: This test is failing
  it('should use sharp if imgix fails', async () => {
    const imageURL = 'https://imgix.cosmicjs.com/image.jpg';
    const cacheMock = { directory: 'test' };
    const axiosMock = axios.get.mockImplementation(() => Promise.reject(new Error('test')));
    // const md5Mock = gatsbyCoreUtils.md5.mockImplementation(() => Promise.resolve('test'));
    // const fetchRemoteFileMock = gatsbyCoreUtils.fetchRemoteFile.mockImplementation(() => Promise.resolve('test'));
    const sharpMock = pluginSharp.getDominantColor.mockImplementation(() => '#000000');

    const result = await getDominantColor(imageURL, cacheMock);

    expect(result).toEqual('#000000');
    expect(axiosMock).toHaveBeenCalledWith(`${imageURL}&palette=json`);
    // expect(md5Mock).toHaveBeenCalledWith(`${imageURL}__DOMINANT_COLOR`);
    // expect(fetchRemoteFileMock).toHaveBeenCalled();
    // expect(sharpMock).toHaveBeenCalled();
  });
});
