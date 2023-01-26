/* eslint-disable camelcase */
import {
  capitalizeFirstLetter,
  createNodeTypeSlug,
} from '../../helpers';

const getChildTypes = (fields, typeSlug) => {
  if (!Array.isArray(fields)) return [];
  if (fields.length === 0) return [];

  const childTypeSchema = {
    name: typeSlug,
    fields: {},
    extensions: {
      infer: true,
    },
  };

  let typesArray = [];
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
        subTypes = getChildTypes(field.children, `${typeSlug}${capitalizeFirstLetter(key)}`);
        break;
      case 'repeater':
        childTypeSchema.fields[key] = `[${typeSlug}${capitalizeFirstLetter(key)}Items]`;
        subTypes = getChildTypes(field.repeater_fields, `${typeSlug}${capitalizeFirstLetter(key)}Items`);
        break;
      default:
        break;
    }

    typesArray = typesArray.concat(subTypes);
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
