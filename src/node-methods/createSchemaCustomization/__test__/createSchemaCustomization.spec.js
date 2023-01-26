import * as gqlUtils from 'gatsby-plugin-image/graphql-utils';
import createSchemaCustomization from '../createSchemaCustomization';
import * as createSchemaObjectForType from '../createSchemaObjectForType';
import * as resolveGatsbyImageData from '../resolveGatsbyImageData';
import * as helpers from '../../../helpers';

jest.mock('gatsby-plugin-image/graphql-utils');

describe('createSchemaCustomization', () => {
  it('should call formatObjects to get the object types', async () => {
    const formatObjectsMock = jest.spyOn(helpers, 'formatObjectTypes').mockImplementation(() => []);
    const schemaMock = {
      buildObjectType: jest.fn().mockImplementation(() => 'test'),
    };
    const createTypesMock = jest.fn();
    const nodeHelpersMock = { schema: schemaMock, actions: { createTypes: createTypesMock } };

    await createSchemaCustomization(nodeHelpersMock, {});

    expect(formatObjectsMock).toHaveBeenCalled();
  });

  it('should flat map over the object types and call createSchemaObjectForType', async () => {
    jest.spyOn(helpers, 'formatObjectTypes').mockImplementation(() => [
      {
        slug: 'test-type',
        metafields: [{
          key: 'text',
          type: 'text',
        }],
      },
      {
        slug: 'test-type-2',
        metafields: [{
          key: 'text',
          type: 'text',
        }],
      },
    ]);
    const createSchemaObjectForTypeMock = jest.spyOn(createSchemaObjectForType, 'default');
    const schemaMock = {
      buildObjectType: jest.fn().mockImplementation(() => ['test']),
    };
    const createTypesMock = jest.fn();
    const nodeHelpersMock = { schema: schemaMock, actions: { createTypes: createTypesMock } };

    await createSchemaCustomization(nodeHelpersMock, {});

    expect(createSchemaObjectForTypeMock).toHaveBeenCalledTimes(2);
  });

  it('should build the image object type', async () => {
    jest.spyOn(helpers, 'formatObjectTypes').mockImplementation(() => []);
    const resolveGatsbyImageDataMock = jest.spyOn(resolveGatsbyImageData, 'default').mockImplementation(() => 'test');
    const getGatsbyImageFieldConfigMock = gqlUtils.getGatsbyImageFieldConfig.mockImplementation((func) => func('test'));
    const schemaMock = {
      buildObjectType: jest.fn().mockImplementation(() => ['test']),
    };
    const createTypesMock = jest.fn();
    const nodeHelpersMock = { schema: schemaMock, actions: { createTypes: createTypesMock } };

    await createSchemaCustomization(nodeHelpersMock, {});

    expect(getGatsbyImageFieldConfigMock).toHaveBeenCalled();
    expect(resolveGatsbyImageDataMock).toHaveBeenCalledWith('test', nodeHelpersMock);
    expect(schemaMock.buildObjectType).toHaveBeenCalledWith(expect.objectContaining({
      name: 'CosmicjsImage',
    }));
  });
});
