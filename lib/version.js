'use strict';

const Package = require('../package.json');
const Database = require('./database');
const Boom = require('boom');

// Declare internals

const internals = {};

exports.plugin = {
    name: 'version',
    version: '1.0.0',
    register: function (server, options) {

        // Use below to test requests to the live server.
        // curl -H "Authorization: Bearer 12345678" -X GET http://localhost:8000/version

        //
        // ./version
        //

        const version = function (request, h) {

            return 'version ' + Package.version + ' ' + options.message;
        };

        server.route({
            method: 'GET',
            path: '/version',
            config: {
                description: 'Returns version of the server.',
                auth: 'default',
                handler: version
            }
        });

        //
        // ./authenticate
        //

        const authenticate = function (request, h) {

            // console.log('DEV LOG request.pre.welcome: ' + JSON.stringify(request.pre.welcome, 0, 2));

            if (request.pre.welcome.message === 'welcome') {

                // return JSON.stringify(request.pre.welcome);
                return request.pre.welcome;
            }

            return Boom.unauthorized('invalid credentials');
        };

        const authenticateUserStep = function (request, h) {

            const result = Database.authenticate(request.payload.username, request.payload.password);

            if (result.authentic === true) {

                // @todo set cache records here (catbox-redis) lesson7.
                // @todo prempt multiple authtokens (lesson7).
                // check if user already authenticated. If yes, return current authtoken.
                // @todo generate token here (cryptiles) lesson8.

                const welcome = { message: 'welcome', token: '12345678' };
                return welcome;
            }

            return 'invalid user';
        };

        server.route({
            method: 'POST',
            path: '/authenticate',
            config: {
                description: 'Authenticates user credentials & returns token.',
                auth: false,
                handler: authenticate,
                pre: [{ method: authenticateUserStep, assign: 'welcome' }]
            }
        });
        // curl -H "Content-Type: application/json" -X POST -d '{"username":"foofoo","password":"12345678"}' https://localhost:8000/authenticate

        //
        // ./private
        //

        const privateHandle =  function (request, h) {

            return 'privateData';
        };

        server.route({
            method: 'GET',
            path: '/private',
            config: {
                description: 'private data for authenticated `admin` users.',
                auth: { strategy: 'default', scope: ['admin'] },
                handler: privateHandle
            }
        });
    }
};
