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

import {
    GraphQLEnumType,
    GraphQLInterfaceType,
    GraphQLObjectType,
    GraphQLList,
    GraphQLNonNull,
    GraphQLSchema,
    GraphQLString,
} from 'graphql';

import { getRelated, getRepository } from './data.js';

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

const repositoryInterface = new GraphQLInterfaceType({
    name: 'Respository',
    description: 'A repository under the hapi umbrella',
    fields: () => ({
        id: {
            type: GraphQLNonNull(GraphQLString),
            description: 'The id of the repository.',
        },
        name: {
            type: GraphQLString,
            description: 'The name of the repository.',
        },
        related: {
            type: GraphQLList(repositoryInterface),
            description:
                'related repositories.',
        },
        description: {
            type: GraphQLString,
            description: 'Description of the repository.',
        },
        www_address: {
            type: GraphQLString,
            description: 'github or other address.',
        }
    }),
    resolveType(character) {

        return hapiType;

        // if (character.type === 'Hapi') {
        //     return hapiType;
        // }
        // if (character.type === 'Xhapi') {
        //     return xhapiType;
        // }
    },
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
const hapiType = new GraphQLObjectType({
    name: 'Hapi',
    description: 'A hapi repository.',
    fields: () => ({
        id: {
            type: GraphQLNonNull(GraphQLString),
            description: 'The id of the repository.',
        },
        name: {
            type: GraphQLString,
            description: 'The name of the repository.',
        },
        related: {
            type: GraphQLList(repositoryInterface),
            description:
                'The repositories related to this project.',
            resolve: hapi => getRelated(hapi),
        },
        description: {
            type: GraphQLString,
            description: 'Description of the repository.',
        },
        www_address: {
            type: GraphQLString,
            description: 'github or other address.',
        }
    }),
    interfaces: [repositoryInterface],
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
const queryType = new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
        hapi : {
            type: hapiType,
            args: {
                id: {
                    description: 'id of the repository',
                    type: GraphQLNonNull(GraphQLString),
                },
            },
            resolve: (root, { id }) => getRepository(id),  // method imported from data.js.
        }
    })
});

/*
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export const schema = new GraphQLSchema({
    query: queryType,
    types: [hapiType],
});
