'use strict';


// Load modules

const Hapi = require('hapi');
const Hoek = require('hoek');
const HapiAuthBearerToken = require('hapi-auth-bearer-token');
const AuthToken = require('./authtoken');

// Load custom plugins

const Version = require('./version');

const internals = {};

internals.customPlugins = [
    { plugin: HapiAuthBearerToken, options: {} },
    { plugin: AuthToken, options: {} },
    { plugin: Version, options: { message: 'lesson4' } }
];

internals.init = async (serverOptions) => {

    Hoek.assert(typeof serverOptions === 'object', new Error('server options be supplied.'));  // @todo add strict validation

    try {

        const server = new Hapi.Server(serverOptions);

        await server.register(internals.customPlugins, { once: true });  // These plugins register only once.

        await server.start();

        return server;
    }
    catch (err) {

        throw err;
    }

};

exports.init = internals.init;
