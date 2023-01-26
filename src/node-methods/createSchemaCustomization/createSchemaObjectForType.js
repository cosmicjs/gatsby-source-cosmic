/* eslint-disable camelcase */
import _ from 'lodash';
import {
  capitalizeFirstLetter,
  createNodeTypeSlug,
} from '../../helpers';

const getChildTypes = (fields, typeSlug, types = []) => {
  if (!Array.isArray(fields)) return [];
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
    let subTypes = [];

    switch (type) {
      case 'file':
        childTypeSchema.fields[key] = 'CosmicjsImage';
        break;
      case 'parent':
        childTypeSchema.fields[key] = `${typeSlug}${capitalizeFirstLetter(key)}`;
        subTypes = getChildTypes(field.children, `${typeSlug}${capitalizeFirstLetter(key)}`, typesArray);
        break;
      default:
        break;
    }

    typesArray.push(...subTypes);
  });

  return typesArray;
};

const createSchemaObjectForType = (objectType) => {
  console.log(JSON.stringify(objectType, null, 2));
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
