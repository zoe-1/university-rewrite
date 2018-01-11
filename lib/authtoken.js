'use strict';

// Declare internals

const internals = {};


const defaultValidateFunc = (request, token) => {


    // @note hapi-auth-bearer-token and scopes.
    // The validate function returns an object (see below).
    // credentials are set in the object and registered to the server with h.authenticated(data)
    // See: https://hapijs.com/api#-hauthenticateddata
    // hapi uses these uses the registered user credentials to inspect for scopes when routes have scopes configured.

    // Future lessons, will use the token and catbox-redis cache to get user credentials from the cache.

    return {
        isValid: token === '12345678',
        credentials: { token, username: 'foofoo', scope: ['admin'] }  // scope set in credentials.
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
