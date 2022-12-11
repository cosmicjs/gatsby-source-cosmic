// Transform all objects into valid config objects.
const createTypeConfigs = (objectTypes, options) => objectTypes.map((typeConfig) => {
  // Create a config object if a string was passed.
  const modifiedTypeConfig = typeof typeConfig === 'string' ? { slug: typeConfig } : typeConfig;

  // Set the default options if not specified on the object config.
  if (typeof modifiedTypeConfig.limit === 'undefined') modifiedTypeConfig.limit = options.limit;
  if (typeof modifiedTypeConfig.depth === 'undefined') modifiedTypeConfig.depth = options.depth;
  if (typeof modifiedTypeConfig.use_cache === 'undefined') modifiedTypeConfig.use_cache = options.use_cache;
  if (typeof modifiedTypeConfig.sort === 'undefined') modifiedTypeConfig.sort = options.sort;
  if (typeof modifiedTypeConfig.status === 'undefined') modifiedTypeConfig.status = options.status;

  return modifiedTypeConfig;
});

export default createTypeConfigs;
