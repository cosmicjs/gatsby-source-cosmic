import Cosmic from 'cosmicjs';

const api = Cosmic();

// TODO: Add tests.
const formatObjectTypes = async ({ reporter }, {
  bucketSlug, readKey, objectTypes, limit,
}) => {
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
      validObjectTypes.push(typeConfig);
    } else {
      invalidObjectTypes.push(typeSlug);
    }
  });

  // Warn the user if any invalid object types were specified.
  if (invalidObjectTypes.length > 0) {
    reporter.warn(`The following object types were not found in your Cosmic bucket:\n\n\t- ${invalidObjectTypes.join(',\n\t- ')}\n\nTHESE OBJECT TYPES WILL BE IGNORED.`);
  }

  // Transform all objects into valid config objects.
  const formattedObjectTypes = validObjectTypes.map((typeConfig) => {
    // Create a config object if a string was passed.
    const modifiedTypeConfig = typeof typeConfig === 'string' ? { slug: typeConfig } : typeConfig;
    // Set the default limit if none was specified.
    if (!modifiedTypeConfig.limit) modifiedTypeConfig.limit = limit;
    // TODO: Other default config options?
    return modifiedTypeConfig;
  });

  return formattedObjectTypes;
};

export default formatObjectTypes;
