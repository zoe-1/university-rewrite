'use strict';

const Package = require('../package.json');

// Declare internals

const internals = {};

exports.plugin = {
    name: 'version',
    version: '1.0.0',
    register: function (server, options) {

        // Use below to test requests to the live server.
        // curl -H "Authorization: Bearer 12345678" -X GET http://localhost:8000/version

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
    }
};
