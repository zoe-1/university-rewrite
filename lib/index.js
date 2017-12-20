'use strict';


// Load modules

const Hapi = require('hapi');
const Hoek = require('hoek');

// Load custom plugins

const Version = require('./version');

const internals = {};

internals.customPlugins = [
    { plugin: Version, options: { message: 'lesson2' } }
];

internals.init = async (serverOptions, callback) => {

    Hoek.assert(typeof serverOptions === 'object', new Error('server options be supplied.'));  // @todo add strict validation
    Hoek.assert(typeof callback === 'function', new Error('callback must be supplied.'));

    const server = new Hapi.Server(serverOptions);

    await server.register(internals.customPlugins, { once: true });  // Our custom plugins register only once.

    await server.start();

    return callback(server);
};

// internals.init().then(() => {
//
//     console.log('post start');
// }).catch((err) => {
//
//     // catch failed start up
//
//     console.log('server failed:!!! ' + err);
// });

exports.init = internals.init;
