import { createValidConfigs } from '../formatObjectTypeHelpers';

describe('createValidConfigs', () => {
  it('should return an array of config objects', () => {
    const objectTypes = ['posts', 'pages'];
    const limit = 10;
    const result = createValidConfigs(objectTypes, limit);
    expect(result).toBeInstanceOf(Array);
    expect(result[0]).toBeInstanceOf(Object);
    expect(result[1]).toBeInstanceOf(Object);
    expect(result[0].slug).toBe('posts');
  });

  it('should return an array of config objects with the correct limit', () => {
    const objectTypes = ['posts', 'pages'];
    const limit = 10;
    const result = createValidConfigs(objectTypes, limit);
    expect(result[0].limit).toBe(10);
    expect(result[1].limit).toBe(10);
  });

  it('should return valid configs with a mixed array of strings and objects', () => {
    const objectTypes = ['posts', { slug: 'pages', limit: 20 }];
    const limit = 10;
    const result = createValidConfigs(objectTypes, limit);
    expect(result[0].slug).toBe('posts');
    expect(result[1].slug).toBe('pages');
    expect(result[0].limit).toBe(10);
    expect(result[1].limit).toBe(20);
  });
});
