'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.get = undefined;

var _graphql = require('graphql');

const Resolver = require('./resolver'); /*
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

const internals = {
    'default': 'next effort'
};

const get = exports.get = async function (server, options) {

    const resolver = await Resolver.init(server, options);

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

    const repositoryInterface = new _graphql.GraphQLInterfaceType({
        name: 'Respository',
        description: 'A repository under the hapi umbrella',
        fields: () => ({
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
        }),
        resolveType(repository) {

            if (repository.type === 'Hapi') {
                return hapi;
            }

            return xHapi;
        }
    });

    /*
     * We define our hapi type, which implements the repository interface.
     *
     * This implements the following type system shorthand:
     *   type Hapi : Repository {
     *     id: String!
     *     name: String
     *     related: [Arrya of Repositories]
     *     description: [String]
     *     www_address: [String]
     *   }
     */
    const hapi = new _graphql.GraphQLObjectType({
        name: 'Hapi',
        description: 'A hapi repository.',
        fields: () => ({
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
                resolve: id => resolver.getRelated(id)
            },
            description: {
                type: _graphql.GraphQLString,
                description: 'Description of the repository.'
            },
            www_address: {
                type: _graphql.GraphQLString,
                description: 'github or other address.'
            }
        }),
        interfaces: [repositoryInterface]
    });

    /*
     * we define a Topic type, which implements xHapi types consume.
     * this implements the following type system shorthand:
     *   type xHapi : repository {
     *     id: string!
     *     name: string
     *     description: [String]
     *   }
     */
    const topic = new _graphql.GraphQLObjectType({
        name: 'Topic',
        fields: {
            id: {
                type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString),
                description: 'The id of the topic.'
            },
            name: { type: _graphql.GraphQLString },
            description: { type: _graphql.GraphQLString }
        }
    });

    /*
     * we define our xHapi type, which implements the repository interface.
     *
     * this implements the following type system shorthand:
     *   type xHapi : repository {
     *     id: string!
     *     name: string
     *     related: [Array of Repositories]
     *     description: [String]
     *     www_address: [String]
     *     topics: [Array of Strings]
     *   }
     */
    const xHapi = new _graphql.GraphQLObjectType({
        name: 'xHapi',
        description: 'A xHapi repository.',
        fields: () => ({
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
                resolve: xHapiRecord => resolver.getRelated(xHapiRecord)
            },
            description: {
                type: _graphql.GraphQLString,
                description: 'Description of the repository.'
            },
            www_address: {
                type: _graphql.GraphQLString,
                description: 'github or other address.'
            },
            topics: {
                type: (0, _graphql.GraphQLList)(topic),
                description: 'Topics related to this project. An Array of strings.',
                resolve: xHapiRecord => resolver.getTopics(xHapiRecord)
            }
        }),
        interfaces: [repositoryInterface]
    });

    /*
     * This is the type that will be the root of our query, and the
     * entry point into our schema. It gives us the ability to fetch
     * objects by their IDs.
     *
     * This implements the following type system shorthand:
     *   type Query {
     *     search(id: String!): Hapi 
     *   }
     *
     */
    const queryType = new _graphql.GraphQLObjectType({
        name: 'Query',
        fields: () => ({
            getRepository: {
                type: repositoryInterface,
                args: {
                    id: {
                        description: 'id of the hapi repository',
                        type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString)
                    }
                },
                resolve: (root, { id }) => resolver.getRepository(id)
            }
        })
    });

    /*
     * Finally, we construct our schema (whose starting query type is the query
     * type we defined above) and return using async await promise.
     */
    const schema = new _graphql.GraphQLSchema({
        query: queryType,
        types: [hapi, xHapi]
    });

    return schema;
};