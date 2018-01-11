'use strict';


// Load modules

const Hapi = require('hapi');
const Hoek = require('hoek');
const HapiAuthBearerToken = require('hapi-auth-bearer-token');
const AuthTokenStrategy = require('./authtoken');
const Cache = require('./cache');

// Load custom plugins

const Version = require('./version');

const internals = {};


internals.init = async (serverOptions, pluginOptions) => {

    Hoek.assert(typeof serverOptions === 'object', new Error('server options be supplied.'));  // @todo add strict validation

    internals.customPlugins = [
        { plugin: HapiAuthBearerToken, options: {} },
        { plugin: AuthTokenStrategy, options: {} },
        { plugin: Version, options: { message: 'lesson7' } },
        { plugin: Cache, options: { expiresIn: pluginOptions.authToken.expiresIn  } }
    ];

    try {

        const server = new Hapi.Server(serverOptions);

        await server.register(internals.customPlugins, { once: true });

        await server.start();

        return server;
    }
    catch (err) {

        throw err;
    }
};

exports.init = internals.init;
