import Cosmic from 'cosmicjs';

const api = Cosmic();

const fetchObjects = async ({ reporter }, { bucketSlug, readKey, objectTypes, limit }) => {
  const bucket = api.bucket({
    slug: bucketSlug,
    read_key: readKey,
  });

  const objects = [];
  const promises = [];
  // TODO: WIP
};

export default fetchObjects;
