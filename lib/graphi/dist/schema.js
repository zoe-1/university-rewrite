'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.schema = undefined;

var _graphql = require('graphql');

var _data = require('./data.js');

/*
 * Repository in the hapiverse.
 *
 * This implements the following type system shorthand:
 *   interface Repository {
 *     id: String!
 *     name: String
 *     related: [Repository]
 *     description: String
 *   }
 */

/*
 * Copyright (c) 2017-present, Jon Swenson.
 *
 * This source code is licensed under the BSD-3-Clause license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Modeled after after example at: 
 * https://github.com/graphql/graphql-js/blob/master/src/__tests__/starWarsData.js 
 * Copyright (c) 2015-present, Facebook, Inc.
 * Their source code is licensed under the MIT license found in the above repository's
 * root directory.
 *
 * Some of the comments and code directly from the graphql project. 
 */

var repositoryInterface = new _graphql.GraphQLInterfaceType({
    name: 'Respository',
    description: 'A repository under the hapi umbrella',
    fields: function fields() {
        return {
            id: {
                type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString),
                description: 'The id of the repository.'
            },
            name: {
                type: _graphql.GraphQLString,
                description: 'The name of the repository.'
            },
            related: {
                type: (0, _graphql.GraphQLList)(repositoryInterface),
                description: 'related repositories.'
            },
            description: {
                type: _graphql.GraphQLString,
                description: 'Description of the repository.'
            },
            www_address: {
                type: _graphql.GraphQLString,
                description: 'github or other address.'
            }
        };
    },
    resolveType: function resolveType(character) {

        return hapiType;

        // if (character.type === 'Hapi') {
        //     return hapiType;
        // }
        // if (character.type === 'Xhapi') {
        //     return xhapiType;
        // }
    }
});

/*
 * We define our hapi type, which implements the character interface.
 *
 * This implements the following type system shorthand:
 *   type Hapi : Repository {
 *     id: String!
 *     name: String
 *     related: [Arrya of Repositories]
 *     description: [String]
 *   }
 */
var hapiType = new _graphql.GraphQLObjectType({
    name: 'Hapi',
    description: 'A hapi repository.',
    fields: function fields() {
        return {
            id: {
                type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString),
                description: 'The id of the repository.'
            },
            name: {
                type: _graphql.GraphQLString,
                description: 'The name of the repository.'
            },
            related: {
                type: (0, _graphql.GraphQLList)(repositoryInterface),
                description: 'The repositories related to this project.',
                resolve: function resolve(hapi) {
                    return (0, _data.getRelated)(hapi);
                }
            },
            description: {
                type: _graphql.GraphQLString,
                description: 'Description of the repository.'
            },
            www_address: {
                type: _graphql.GraphQLString,
                description: 'github or other address.'
            }
        };
    },
    interfaces: [repositoryInterface]
});

/*
 * This is the type that will be the root of our query, and the
 * entry point into our schema. It gives us the ability to fetch
 * objects by their IDs.
 *
 * This implements the following type system shorthand:
 *   type Query {
 *     hapi(id: String!): Hapi 
 *   }
 *
 */
var queryType = new _graphql.GraphQLObjectType({
    name: 'Query',
    fields: function fields() {
        return {
            hapi: {
                type: hapiType,
                args: {
                    id: {
                        description: 'id of the repository',
                        type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString)
                    }
                },
                resolve: function resolve(root, _ref) {
                    var id = _ref.id;
                    return (0, _data.getRepository)(id);
                } // method imported from data.js.
            }
        };
    }
});

/*
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
var schema = exports.schema = new _graphql.GraphQLSchema({
    query: queryType,
    types: [hapiType]
});
