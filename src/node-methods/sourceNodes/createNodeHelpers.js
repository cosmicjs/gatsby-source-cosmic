import _ from 'lodash';

const createNodeTypeSlug = (slug) => {
  let typeSlug = _.camelCase(slug);
  typeSlug = typeSlug.charAt(0).toUpperCase() + typeSlug.slice(1);
  return `Cosmicjs${typeSlug}`;
};

// Disable rule for now, as we may add more functions to this file in the future.
// eslint-disable-next-line import/prefer-default-export
export { createNodeTypeSlug };
