import { createNodeTypeSlug } from '../createNodeHelpers';

describe('createNodeTypeSlug', () => {
  it('should create a CapitalCase slug', () => {
    const slug = 'test-slug';
    const expectedSlug = 'CosmicjsTestSlug';

    const result = createNodeTypeSlug(slug);

    expect(result).toBe(expectedSlug);
  });

  it('should create a CapitalCase slug with a number', () => {
    const slug = 'test-slug-1';
    const expectedSlug = 'CosmicjsTestSlug1';

    const result = createNodeTypeSlug(slug);

    expect(result).toBe(expectedSlug);
  });

  it('should handle a slug with a number at the beginning', () => {
    const slug = '1-test-slug';
    const expectedSlug = 'Cosmicjs1TestSlug';

    const result = createNodeTypeSlug(slug);

    expect(result).toBe(expectedSlug);
  });
});
