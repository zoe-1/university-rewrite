'use strict';


// Load modules

const Hapi = require('hapi');

const Version = require('./version');

const internals = {};

internals.customPlugins = [
    { plugin: Version, options: { message: 'lesson2' } }
];

internals.init = async (serverOptions, callback) => {

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
