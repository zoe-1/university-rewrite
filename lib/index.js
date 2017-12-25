'use strict';


// Load modules

const Hapi = require('hapi');
const Hoek = require('hoek');

// Load custom plugins

const Version = require('./version');

const internals = {};

internals.customPlugins = [
    { plugin: Version, options: { message: 'lesson3' } }
];

internals.init = async (serverOptions) => {

    Hoek.assert(typeof serverOptions === 'object', new Error('server options be supplied.'));  // @todo add strict validation

    try {

        const server = new Hapi.Server(serverOptions);

        await server.register(internals.customPlugins, { once: true });  // Our custom plugins register only once.
        await server.start();
        return server;
    }
    catch (err) {

        throw err;
    }

};

exports.init = internals.init;
