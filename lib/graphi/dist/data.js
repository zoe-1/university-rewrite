'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getRepository = getRepository;
exports.getRelated = getRelated;
exports.getTopics = getTopics;
/*
 * Copyright (c) 2017-present, Jon Swenson.
 *
 * This source code is licensed under the BSD-3-Clause license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Modeled after after the example at:
 * https://github.com/graphql/graphql-js/blob/master/src/__tests__/starWarsData.js
 * Copyright (c) 2015-present, Facebook, Inc.
 * Their source code is licensed under the MIT license found in the above repository's
 * root directory.
 *
 * Some of the comments and code directly from the graphql project.
 *
 */

const database = [{
    type: 'Hapi',
    id: '1000',
    name: 'hapi',
    related: ['1001', '1002', '1003'],
    description: 'A rich framework for building web applications.',
    www_address: 'https://github.com/hapijs/hapi'
}, {
    type: 'Hapi',
    id: '1001',
    name: 'http-auth-bearer-token',
    related: ['1000'],
    description: 'Implements auth-bearer-token strategy on hapi servers.',
    www_address: 'https://github.com/johnbrett/hapi-auth-bearer-token'
}, {
    type: 'Hapi',
    id: '1002',
    name: 'catbox-policy',
    related: ['1000', '1003'],
    description: 'Configure policies to store and maintain objects in cache.',
    www_address: 'https://github.com/hapijs/catbox'
}, {
    type: 'Hapi',
    id: '1003',
    name: 'catbox-redis',
    related: ['1000', '1002'],
    description: 'Implement catbox-policy with redisdb.',
    www_address: 'https://github.com/hapijs/catbox-redis'
}, {
    type: 'xHapi',
    id: '1004',
    name: 'browserify',
    related: ['1004'],
    description: 'bundler',
    www_address: 'http://browserify.org',
    topics: ['1007', '1008']
}, {
    type: 'xHapi',
    id: '1005',
    name: 'reactjs',
    related: ['1004', '1006'],
    description: 'user interface builder',
    www_address: 'https://reactjs.org',
    topics: ['1007', '1008']
}, {
    type: 'xHapi',
    id: '1006',
    name: 'webpack',
    related: ['1004'],
    description: 'bundler',
    www_address: 'https://webpack.js.org',
    topics: ['1007', '1008']
}, {
    type: 'Topic',
    id: '1007',
    name: 'front-end development',
    description: 'none'
}, {
    type: 'Topic',
    id: '1008',
    name: 'bundler',
    description: 'none'
}];
//
// export type Topic = {
//     type: 'Topic',
//     id: string,
//     name: string,
//     related: Array<string>,
//     description: string,
//     www_address: string,
//     topics: Array<string>
// };

/**
 * Allows us to query for the repository with the given id.
 */

function getRepository(id) {

    for (let i = 0; i < database.length; ++i) {

        if (database[i].id === id) {

            return database[i];
        }
    };

    return undefined;

    // @note
    //  after below complies with babel part of the compiled
    //  script does not get coverage.  So, changed to the above for coverage.
    //  for (const respository of database) {

    //     if (respository.id === id) {

    //         return respository;
    //     }
    // }
}

/*
 * Helper function to get a repository by ID.
 */
const getRelatedRepo = function (id) {

    // Returning a promise just to illustrate GraphQL.js's support.
    // return Promise.resolve(repositoryData[id]);
    return Promise.resolve(getRepository(id));
};

/**
 * Allows us to query for a repository's related repos.
 */
function getRelated(repository) {

    // Notice that GraphQL accepts Arrays of Promises.
    return repository.related.map(id => getRelatedRepo(id));
}

/**
 * Allows us to query for xHapi repository's related topic.
 */
function getTopics(record) {

    return record.topics.map(id => getRepository(id));
}