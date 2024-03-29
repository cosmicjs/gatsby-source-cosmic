import { createBucketClient } from '@cosmicjs/sdk';
import createTypeConfigs from './createTypeConfigs';
import fetchObjectTypes from './fetchObjectTypes';

const formatObjectTypes = async (nodeAPIHelpers, options) => {
  const { reporter } = nodeAPIHelpers;
  const { bucketSlug, readKey, objectTypes } = options;
  const invalidObjectTypes = [];
  const validObjectTypes = [];
  const fetchedTypeSlugs = [];
  const fetchedTypeMetafields = {};
  const bucket = createBucketClient({
    bucketSlug,
    readKey,
  });
  try {
    const result = await fetchObjectTypes(nodeAPIHelpers, options, bucket);
    fetchedTypeSlugs.push(...result.map(({ slug }) => slug));
    result.forEach((type) => {
      fetchedTypeMetafields[type.slug] = type.metafields;
    });
  } catch (error) {
    // TODO: Improve error handling & logging.
    reporter.panic('Unable to fetch object types from Cosmic.', error);
    return [];
  }

  if (!Array.isArray(objectTypes) || objectTypes.length === 0) {
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

  return createTypeConfigs(options, validObjectTypes, fetchedTypeMetafields);
};

export default formatObjectTypes;
