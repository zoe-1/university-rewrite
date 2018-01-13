'use strict';

const Package = require('../package.json');
const Database = require('./database');
const Boom = require('boom');
const Cryptiles = require('cryptiles');

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

            if (request.pre.welcome.result === 'welcome') {

                return request.pre.welcome;
            }

            return Boom.unauthorized('invalid credentials');
        };

        const authenticatePreperation = async function (request, h) {

            const result = Database.authenticate(request.payload.username, request.payload.password);

            if (result.authentic === true) {

                // * set cache records here (catbox-redis) lesson7.
                // * prempt multiple authtokens
                //   if user already authenticated then return current authtoken.
                // * generate token with cryptiles.

                const activeuser = await request.server.app.active.get(request.payload.username);

                if (activeuser.value !== null) {

                    return { result: 'welcome',  message: 'you already registered a token!', token: activeuser.value.authtoken };
                }

                const randomAuthToken = Cryptiles.randomString(36);

                const authTokenCacheRecord = {
                    username: result.userRecord.username,
                    email: result.userRecord.email,
                    scope: result.userRecord.scope
                };

                await request.server.app.authtokens.set(randomAuthToken, authTokenCacheRecord);

                const activeCacheRecord = {
                    authtoken: randomAuthToken,
                    username: result.userRecord.username,
                    email: result.userRecord.email,
                    scope: result.userRecord.scope
                };

                await request.server.app.active.set(result.userRecord.username, activeCacheRecord);

                const welcome = { result: 'welcome', message: 'successful authentication', token: randomAuthToken };

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
                pre: [{ method: authenticatePreperation, assign: 'welcome' }]
            }
        });

        //
        // ./private
        //

        const privateHandle =  function (request, h) {

            return 'privateData';
        };

        const onPreResponseStep = function (request, h) {

            const  response = request.response;

            if (
                (response.isBoom) &&
                (response.message === 'Authentication data missing credentials information')
            ) {

                // Attempt was made to access private data with bad credentials

                request.server.log(['authentication', 'error', 'abuse'], 'Authentication data missing credentials information');
            }

            return h.continue;

        };

        server.route({
            method: 'GET',
            path: '/private',
            config: {
                description: 'private data for authenticated `admin` users.',
                auth: { strategy: 'default', scope: ['admin'] },
                handler: privateHandle,
                ext: {
                    onPreResponse: { method: onPreResponseStep }
                }
            }
        });
    }
};

// curl -H "Content-Type: application/json" -X POST -d '{"username":"foofoo","password":"12345678"}' https://localhost:8000/authenticate
