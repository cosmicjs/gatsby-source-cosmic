import _ from 'lodash';

const createNodeTypeSlug = (slug) => {
  let typeSlug = _.camelCase(slug);
  typeSlug = typeSlug.charAt(0).toUpperCase() + typeSlug.slice(1);
  return `Cosmicjs${typeSlug}`;
};

export default createNodeTypeSlug;
