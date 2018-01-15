'use strict';

// Load modules

const Hapi = require('hapi');
const Hoek = require('hoek');
const HapiAuthBearerToken = require('hapi-auth-bearer-token');
const AuthTokenStrategy = require('./authtoken');
const Cache = require('./cache');
const Good = require('good');
const Graphi = require('./graphi');
const Config = require('./config');

// route plugins 

const Version = require('./version');
const User = require('./user');

const internals = {};

internals.init = async (environment) => {

    Hoek.assert(typeof environment === 'string', new Error('server environment must be supplied.'));

    try {

        const options = await Config.get(environment);

        internals.plugins = [
            { plugin: HapiAuthBearerToken, options: {} },
            { plugin: AuthTokenStrategy, options: {} },
            { plugin: Version, options: {} },
            { plugin: User, options: {} },
            { plugin: Cache, options: { expiresIn: options.plugins.authToken.expiresIn  } },
            { plugin: Good, options: options.plugins.good },
            { plugin: Graphi, options: options.plugins.graphi }
        ];

        const server = new Hapi.Server(options.server);

        await server.register(internals.plugins, { once: true });

        await server.start();

        return server;
    }
    catch (err) {

        throw err;
    }
};

exports.init = internals.init;
