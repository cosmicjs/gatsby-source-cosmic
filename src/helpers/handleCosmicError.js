import { startsWith } from 'lodash';

// TODO: Ask for list of error types, add better handling where possible.
const handleCosmicError = (error, reporter, objectType) => {
  if (error && error.status === 404 && startsWith(error.message, 'No objects found for your query')) {
    reporter.warn(`WARNING: No objects found for your query with the following config:\n${JSON.stringify(objectType, null, 2)}\n`);
    return;
  }

  reporter.panic(`ERROR: Problem fetching objects from cosmic.\n${JSON.stringify(error, null, 2)}\n`);
};

export default handleCosmicError;
