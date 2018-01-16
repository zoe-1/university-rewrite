'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getRelated = getRelated;
exports.getRepository = getRepository;
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
 */

var hapi = {
    type: 'Hapi',
    id: '1000',
    name: 'hapi',
    related: ['1001', '1002', '1003'],
    description: 'A rich framework for building web applications.',
    www_address: 'https://github.com/hapijs/hapi'
};

var http_auth_bearer_token = {
    type: 'Hapi',
    id: '1001',
    name: 'http-auth-bearer-token',
    related: ['1000'],
    description: 'Implements auth-bearer-token strategy on hapi servers.',
    www_address: 'https://github.com/johnbrett/hapi-auth-bearer-token'
};

var catbox_policy = {
    type: 'Hapi',
    id: '1002',
    name: 'catbox-policy',
    related: ['1000', '1003'],
    description: 'Configure policies to store and maintian objects in cache.',
    www_address: 'https://github.com/hapijs/catbox'
};

var catbox_redis = {
    type: 'Hapi',
    id: '1003',
    name: 'catbox-redis',
    related: ['1000', '1002'],
    description: 'Implement catbox-policy with redisdb.',
    www_address: 'https://github.com/hapijs/catbox-redis'
};

var repositoryData = {
    '1000': hapi,
    '1001': http_auth_bearer_token,
    '1002': catbox_policy,
    '1003': catbox_redis
};

// export type Repository = {
//     id: string,
//     name: string,
//     related: Array<string>,
//     description: string
// };
// 
// export type Hapi = {
//     type: 'Hapi',
//     id: string,
//     name: string,
//     related: Array<string>,
//     description: string
// };

/*
 * Helper function to get a repository by ID.
 */
function getRelatedRepo(id) {

    // Returning a promise just to illustrate GraphQL.js's support.
    return Promise.resolve(repositoryData[id]);
}

/**
 * Allows us to query for a repository's related repos.
 */
function getRelated(repository) {

    // Notice that GraphQL accepts Arrays of Promises.
    return repository.related.map(function (id) {
        return getRelatedRepo(id);
    });
}

/**
 * Allows us to query for the repository with the given id.
 */
function getRepository(id) {

    return repositoryData[id];
}
