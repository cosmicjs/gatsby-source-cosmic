// Writing as a helper function for testing.
const fetchObjectTypes = async (bucket) => {
  const results = await bucket.getObjectTypes();
  return results.object_types;
};

export default fetchObjectTypes;
