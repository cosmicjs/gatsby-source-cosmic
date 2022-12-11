import Cosmic from 'cosmicjs';
import createTypeConfigs from './createTypeConfigs';
import fetchObjectTypes from './fetchObjectTypes';

const api = Cosmic();

const formatObjectTypes = async ({ reporter }, options) => {
  const { bucketSlug, readKey, objectTypes } = options;
  const invalidObjectTypes = [];
  const validObjectTypes = [];
  const fetchedTypeSlugs = [];
  const bucket = api.bucket({
    slug: bucketSlug,
    read_key: readKey,
  });
  try {
    const result = await fetchObjectTypes(bucket);
    fetchedTypeSlugs.push(...result.map(({ slug }) => slug));
  } catch (error) {
    // TODO: Improve error handling & logging.
    reporter.panic('Unable to fetch object types from Cosmic.', error);
    return [];
  }

  if (objectTypes.length === 0) {
    // If no object types were specified in the config, use the fetched object types.
    validObjectTypes.push(...fetchedTypeSlugs);
  } else {
    // If object types were specified in the config, check that the slugs are valid.
    objectTypes.forEach((typeConfig) => {
      const typeSlug = typeof typeConfig === 'string' ? typeConfig : typeConfig.slug;
      if (fetchedTypeSlugs.includes(typeSlug)) {
        validObjectTypes.push(typeConfig);
      } else {
        invalidObjectTypes.push(typeSlug);
      }
    });
  }

  // Warn the user if any invalid object types were specified.
  if (invalidObjectTypes.length > 0) {
    reporter.warn(`The following object types were not found in your Cosmic bucket:\n\n\t- ${invalidObjectTypes.join(',\n\t- ')}\n\nTHESE OBJECT TYPES WILL BE IGNORED.`);
  }

  return createTypeConfigs(validObjectTypes, options);
};

export default formatObjectTypes;
