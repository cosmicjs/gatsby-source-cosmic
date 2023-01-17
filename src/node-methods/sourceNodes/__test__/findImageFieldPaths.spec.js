import findImageFieldPaths from '../findImageFieldPaths';

describe('findImageFieldPaths', () => {
  it('Should return an array of paths to image fields', () => {
    const data = {
      metadata: {
        image: {
          url: 'https://cosmicjs.com',
          imgix_url: 'https://cosmicjs.com',
        },
      },
    };

    const result = findImageFieldPaths(data);

    expect(result).toEqual(['metadata.image']);
  });

  it('Should return an array of paths to image fields in an array', () => {
    const data = {
      metadata: {
        images: [
          {
            url: 'https://cosmicjs.com',
            imgix_url: 'https://cosmicjs.com',
          },
          {
            url: 'https://cosmicjs.com',
            imgix_url: 'https://cosmicjs.com',
          },
        ],
      },
    };

    const result = findImageFieldPaths(data);

    expect(result).toEqual(['metadata.images[0]', 'metadata.images[1]']);
  });

  it('Should return an array of paths to image fields in an array of objects', () => {
    const data = {
      metadata: {
        images: [
          {
            image: {
              url: 'https://cosmicjs.com',
              imgix_url: 'https://cosmicjs.com',
            },
          },
          {
            image: {
              url: 'https://cosmicjs.com',
              imgix_url: 'https://cosmicjs.com',
            },
          },
        ],
      },
    };

    const result = findImageFieldPaths(data);

    expect(result).toEqual(['metadata.images[0].image', 'metadata.images[1].image']);
  });

  it('Should return an empty array if no image fields are found', () => {
    const data = {
      metadata: {
        notAnImage: {
          this: 'is not an image',
        },
      },
    };

    const result = findImageFieldPaths(data);

    expect(result).toEqual([]);
  });
});
