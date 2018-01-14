'use strict';


const internals = {};

exports.plugin = {
    name: 'cache',
    version: '1.0.0',
    description: 'catbox policies for authtokens and active users',
    register: async (server, options) => {

        await server.cache.provision({ engine: require('catbox-redis'), name: 'authtokens' });
        await server.cache.provision({ engine: require('catbox-redis'), name: 'active' });

        // authtokens cache policy

        const policyOptions = {
            cache: 'authtokens',
            expiresIn: options.expiresIn,
            getDecoratedValue: true
        };

        const cache = server.cache(policyOptions);

        server.app.authtokens = cache;

        // active user policy

        const activeUserPolicyOptions = {
            cache: 'active',
            expiresIn: options.expiresIn,
            getDecoratedValue: true
        };

        const activeCache = server.cache(activeUserPolicyOptions);

        server.app.active = activeCache;
    }
};

// Notes on cache business logic.
// * auth-bearer-token strategy and redis-cache 
//   Upon successfull authentication a token is issued to the user.
//   The token is stored in the rediscache using the configured catbox-policy: `authtokens`.
//   The policy determines how long the token will be valid: `expiresIn`. This value is
//   configured in the options passed to Server.init(serverOptions, pluginOptions).    
//   Requests made to the application require a valid token set in the headers.
//   Each time a token is used to make a request, the rediscache is used to confirm if the token is valid or not.
// * prempt multiple tokens
//   To prevent a user from registering multiple tokens with the application
//   we use a cache named `active` to record each authenticated/active user. 
//   An active cache record contains the authtoken for an active user. At authentication we confirm
//   the `active` cache does not already contain an authtoken for the user. If the authenticated
//   user already has a valid authtoken, we return the authtoken rather than create a new one.

// set cache records after successfull authentication
// await cache.set('12345678', { username: 'zoelogic', email: 'jswenson74@gmail.com', scope: ['admin', 'user'] });
