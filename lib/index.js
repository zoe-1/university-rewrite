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

internals.init = async (serverOptions) => {

    Hoek.assert(typeof serverOptions === 'object', new Error('server options be supplied.'));  // @todo add strict validation

    try {

        const server = new Hapi.Server(serverOptions);

        await server.register(internals.customPlugins, { once: true });  // Our custom plugins register only once.
        await server.start();
        return server;
    }
    catch (err) {

        throw err;
    }

};
// internals.init = async (serverOptions, callback) => {
// 
//     Hoek.assert(typeof serverOptions === 'object', new Error('server options be supplied.'));  // @todo add strict validation
//     // Hoek.assert(typeof callback === 'function', new Error('callback must be supplied.'));
// 
//     try {
// 
//         const server = new Hapi.Server(serverOptions);
// 
//         await server.register(internals.customPlugins, { once: true });  // Our custom plugins register only once.
//         await server.start();
// 
//         callback(null, server);
//     }
//     catch (err) {
// 
//         callback(err, null);
//         // throw err;
//     }
// 
//     // return new Promise ((resolve, reject) => {
//     //
//     //     const init = async () => {
//     //
//     //         try {
//     //
//     //             internals.server = new Hapi.Server(serverOptions);
// 
//     //             await internals.server.register(internals.customPlugins, { once: true });  // Our custom plugins register only once.
//     //             await internals.server.start();
// 
//     //             resolve(internals.server);
//     //         }
//     //         catch (err) {
// 
//     //             return reject(err);
//     //         }
// 
//     //         init();
//     //     };
//     // });
// };

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
