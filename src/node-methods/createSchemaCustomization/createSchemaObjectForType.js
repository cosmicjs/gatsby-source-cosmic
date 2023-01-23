/* eslint-disable camelcase */
import _ from 'lodash';
import {
  createNodeTypeSlug,
} from '../../helpers';

const getChildTypes = (fields, typeSlug, types = []) => {
  const typesArray = _.cloneDeep(types);

  const childTypeSchema = {
    name: typeSlug,
    fields: {},
    extensions: {
      infer: true,
    },
  };

  typesArray.push(childTypeSchema);

  fields.forEach((field) => {
    const { key, type } = field;

    switch (type) {
      case 'file':
        childTypeSchema.fields[key] = 'CosmicjsImage';
        break;
      default:
        break;
    }
  });

  return typesArray;
};

const createSchemaObjectForType = (objectType) => {
  let types = [];
  const name = createNodeTypeSlug(objectType.slug);

  const objectSchema = {
    name,
    fields: {},
    interfaces: ['Node'],
    extensions: {
      // In the future when the Cosmic Schema is strongly typed, we can set this to false
      infer: true,
    },
  };

  types.push(objectSchema);

  types = types.concat(getChildTypes(objectType.metafields, `${name}Metadata`));
  return types;
};

export {
  getChildTypes,
};

export default createSchemaObjectForType;
