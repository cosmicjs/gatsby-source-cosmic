// Transform all objects into valid config objects.
const createValidConfigs = (objectTypes, limit) => objectTypes.map((typeConfig) => {
  // Create a config object if a string was passed.
  const modifiedTypeConfig = typeof typeConfig === 'string' ? { slug: typeConfig } : typeConfig;
  // Set the default limit if none was specified.
  if (!modifiedTypeConfig.limit) modifiedTypeConfig.limit = limit;
  // TODO: Other default config options?
  return modifiedTypeConfig;
});

// Writing as a helper function for testing.
const fetchObjectTypes = async (bucket) => {
  const results = await bucket.getObjectTypes();
  return results.object_types;
};

export {
  createValidConfigs,
  fetchObjectTypes,
};
