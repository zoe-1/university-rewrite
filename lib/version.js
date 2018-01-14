'use strict';

// Declare internals

const internals = {};

// routeMethods

const { Private, OnPreResponse } = require('./routeMethod/private');
const { Version } = require('./routeMethod/version');


exports.plugin = {
    name: 'version',
    version: '1.0.0',
    register: function (server, options) {

        server.route({
            method: 'GET',
            path: '/version',
            config: {
                description: 'Returns version of the server.',
                auth: 'default',
                handler: Version
            }
        });

        server.route({
            method: 'GET',
            path: '/private',
            config: {
                description: 'private data for authenticated `admin` users.',
                auth: { strategy: 'default', scope: ['admin'] },
                handler: Private,
                ext: {
                    onPreResponse: { method: OnPreResponse }
                }
            }
        });
    }
};

// curl -H "Content-Type: application/json" -X POST -d '{"username":"foofoo","password":"12345678"}' https://localhost:8000/authenticate
