import Cosmic from 'cosmicjs';

const api = Cosmic();

// TODO: Add tests.

const checkObjectTypes = async ({ reporter }, { bucketSlug, readKey, objectTypes }) => {
  const bucket = api.bucket({
    slug: bucketSlug,
    read_key: readKey,
  });
  let fetchedObjectTypes = [];
  try {
    const results = await bucket.getObjectTypes();
    fetchedObjectTypes = results.object_types;
  } catch (error) {
    // TODO: Improve error handling & logging.
    reporter.error('Unable to fetch object types from Cosmic.', error);
  }

  // If no object types were specified, return all object types.
  const fetchedTypeSlugs = fetchedObjectTypes.map(({ slug }) => slug);
  if (objectTypes.length === 0) {
    return fetchedTypeSlugs;
  }

  // If object types were specified, check that the slugs are valid.
  const invalidObjectTypes = [];
  const validObjectTypes = [];
  objectTypes.forEach((typeConfig) => {
    const typeSlug = typeof typeConfig === 'string' ? typeConfig : typeConfig.slug;
    if (fetchedTypeSlugs.includes(typeSlug)) {
      validObjectTypes.push(typeSlug);
    } else {
      invalidObjectTypes.push(typeSlug);
    }
  });

  // Warn the user if any invalid object types were specified.
  if (invalidObjectTypes.length > 0) {
    reporter.warn(`The following object types were not found in your Cosmic bucket:\n\n\t- ${invalidObjectTypes.join(',\n\t- ')}\n\nTHESE OBJECT TYPES WILL BE IGNORED.`);
  }

  return validObjectTypes;
};

export default checkObjectTypes;
