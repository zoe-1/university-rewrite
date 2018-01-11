'use strict';

// Declare internals

const internals = {};


const defaultValidateFunc = async (request, token) => {

    // @note hapi-auth-bearer-token and scopes.
    // * This validate function returns an object (see below).
    //   credentials are set in the object and registered to the server with h.authenticated(data)
    //   See: https://hapijs.com/api#-hauthenticateddata hapi-auth-bearer-token does 
    //   this for you.
    // * hapi uses registered user credentials to inspect for scopes when routes have scopes configured.
    //   Use the token and catbox-redis cache to get user credentials from the cache.

    const authtoken = await request.server.app.authtokens.get(token);

    return {
        isValid: authtoken.value !== null,
        credentials: authtoken.value
    };
};

exports.plugin = {
    name: 'authtoken',
    version: '1.0.0',
    description: 'register hapi-auth-bearer-token strategy.',
    register: function (server, options) {

        server.auth.strategy('default', 'bearer-access-token', {
            validate: defaultValidateFunc
        });
        server.auth.default('default');
    }
};
