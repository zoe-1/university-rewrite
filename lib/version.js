'use strict';

const Package = require('../package.json');

// Declare internals

const internals = {};

exports.plugin = {
    name: 'version',
    version: '1.0.0',
    register: function (server, options) {

        // const version = function (request, h) {

        //     return 'version ' + Package.version + ' ' + options.message;
        // };

        server.route({
            method: 'GET',
            path: '/version',
            config: {
                description: 'Returns version of the server.',
                handler: function (request, h) {

                    return 'version ' + Package.version + ' ' + options.message;
                }
            }
        });
    }
};
