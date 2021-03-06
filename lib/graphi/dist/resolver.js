'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});


const internals = {
    'default': 'resolvers'
};

const Store = require('./dataRecords');

// ## resolver.getRelated(xHapiRecord) 
// ## resolver.getTopics(xHapiRecord) 
// ## resolver.g etRepository(id) 

const init = exports.init = async function (server, options) {

    const resolver = {};

    /**
     * Allows us to query the repository with the given id.
     */

    resolver.getRepository = function (id) {

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
    resolver.getRelated = function (repository) {

        // Notice that GraphQL accepts Arrays of Promises.
        return repository.related.map(id => this.getRelatedRepo(id));
    };

    /**
     * Allows us to query for xHapi repository's related topic.
     */
    resolver.getTopics = function (record) {

        return record.topics.map(id => this.getRepository(id));
    };

    /**
     * Mutate/change repository name.
     */
    resolver.changeName = function (id, name) {

        const repo = this.getRepository(id);
        // const repo = Store.data[0];


        if (repo === undefined) {

            return repo; // @todo improve error handling. 
        }

        // console.log('WATCH** repo' + repo);
        // console.log('WATCH** Store ' + repo.name);

        repo.name = name;

        return repo;
    };

    return resolver;
};