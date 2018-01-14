'use strict';

const internals = {};

// routeMethods

const { Authenticate, AuthenticateUser } = require('./routeMethod/authenticate');

exports.plugin = {
    name: 'user',
    version: '1.0.0',
    register: function (server, options) {

        server.route({
            method: 'POST',
            path: '/authenticate',
            config: {
                description: 'Authenticates user credentials & returns token.',
                auth: false,
                handler: Authenticate,
                pre: [{ method: AuthenticateUser, assign: 'welcome' }]
            }
        });
    }
};

