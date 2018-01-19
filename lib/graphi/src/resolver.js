'use strict';

// @flow

const internals = {
    'default': 'resolvers'
};

const Store = require('./dataRecords');

type Server = Object;

type Options = {
    grahpiql: 'info here', 
    authStrategy: 'strategy name'
};

// ## resolver.getRelated(xHapiRecord) 
// ## resolver.getTopics(xHapiRecord) 
// ## resolver.getRepository(id) 

export const init = async function (server: Server, options: Options) {

    const resolver = {};

    resolver.getRelated = async function (userRecord: Object) {

        // database query logic

        return 'inserted user record';
    };

    resolver.getTopics = async function (userRecord: Object) {

        // database query logic

        return 'deleted user record';
    };

    type Repository = {
        id: string,
        name: string,
        related: Array<string>,
        description: string
    };

    type Hapi = {
        type: 'Hapi',
        id: string,
        name: string,
        related: Array<string>,
        description: string,
        www_address: string
    };

    type xHapi = {
        type: 'xHapi',
        id: string,
        name: string,
        related: Array<string>,
        description: string,
        www_address: string,
        topics: Array<string>
    };

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
     * Allows us to query the repository with the given id.
     */

    type Repos = Hapi | xHapi | typeof undefined;

    resolver.getRepository = function (id: string): Repos {

        for (let i = 0; i < Store.data.length; ++i) {

            if (Store.data[i].id === id) {

                return Store.data[i];
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

    };

    /*
     * Helper function to get a repository by ID.
     */
    resolver.getRelatedRepo = function (id) {

        // Returning a promise just to illustrate GraphQL.js's support.
        // return Promise.resolve(repositoryData[id]);
        return Promise.resolve(this.getRepository(id));
    };

    /**
     * Allows us to query for a repository's related repos.
     */
    resolver.getRelated = function (repository: Repository): Array<Promise<Repos>> {

        // Notice that GraphQL accepts Arrays of Promises.
        return repository.related.map(id => this.getRelatedRepo(id));
    };


    /**
     * Allows us to query for xHapi repository's related topic.
     */
    resolver.getTopics = function (record: xHapi): Array<Repos> {

        return record.topics.map(id => this.getRepository(id));
    };

    return resolver;
};
