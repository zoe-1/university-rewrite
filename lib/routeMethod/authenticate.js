'use strict';

const Database = require('../database');
const Boom = require('boom');
const Cryptiles = require('cryptiles');

const internals = {};


exports.Authenticate = function (request, h) {

    // console.log('DEV LOG request.pre.welcome: ' + JSON.stringify(request.pre.welcome, 0, 2));

    if (request.pre.welcome.result === 'welcome') {

        return request.pre.welcome;
    }

    return Boom.unauthorized('invalid credentials');
};


exports.AuthenticateUser = async function (request, h) {

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
