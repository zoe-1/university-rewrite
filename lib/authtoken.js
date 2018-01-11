'use strict';

// Declare internals

const internals = {};


const defaultValidateFunc = (request, token) => {

    // Uses catbox policy for token authentication here (lesson7 or 8).

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
