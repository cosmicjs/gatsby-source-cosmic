import * as fs from 'fs-extra';
import * as fetchUtils from 'gatsby-core-utils/dist/fetch-remote-file';
import getBase64Image, {
  fetchedBase64Images,
  inProgressBase64Images,
} from '../getBase64Image';

jest.mock('fs-extra');
jest.mock('gatsby-core-utils/dist/fetch-remote-file');

const cache = {
  directory: 'test',
};

describe('getBase64Image', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete fetchedBase64Images['https://imgix.cosmicjs.com/test.jpg'];
  });

  it('should return null if no image is provided', async () => {
    const imageURL = null;

    const result = await getBase64Image(imageURL, { cache });

    expect(result).toEqual(null);
  });

  it('should return null if the image is not from imgix', async () => {
    const imageURL = 'https://google.com';

    const result = await getBase64Image(imageURL, { cache });

    expect(result).toEqual(null);
  });

  it('should return the image if it has already been fetched', async () => {
    const imageURL = 'https://imgix.cosmicjs.com';
    fetchedBase64Images[imageURL] = 'test';

    const result = await getBase64Image(imageURL, { cache });

    expect(result).toEqual('test');
  });

  it('should attempt to fetch the remote file and read it from the filesystem', async () => {
    const imageURL = 'https://imgix.cosmicjs.com/test.jpg';
    const fetchMock = fetchUtils.fetchRemoteFile.mockImplementation(() => 'test.jpg');
    const readMock = fs.readFile.mockImplementation(() => '<file contents>');

    const result = await getBase64Image(imageURL, { cache });

    expect(fetchMock).toHaveBeenCalled();
    expect(readMock).toHaveBeenCalled();
    expect(result).toEqual('data:image/jpeg;base64,<file contents>');
  });

  it('should return a promise if the image is currently being fetched', async () => {
    const imageURL = 'https://imgix.cosmicjs.com/test.jpg';
    const testPromise = new Promise(() => {});
    fetchUtils.fetchRemoteFile.mockImplementation(() => testPromise);
    fs.readFile.mockImplementation(() => '<file content>');

    const result = getBase64Image(imageURL, { cache });

    expect(inProgressBase64Images[imageURL]).toEqual(testPromise);
    expect(result).toEqual(testPromise);
  });

  it('should return a promise if there is one in the cache', async () => {
    const imageURL = 'https://imgix.cosmicjs.com/test.jpg';
    const testPromise = new Promise(() => {});
    inProgressBase64Images[imageURL] = testPromise;

    const result = getBase64Image(imageURL, { cache });

    expect(result).toEqual(testPromise);
  });
});
