'use strict';


// Load modules

const Hapi = require('hapi');


// Our custom plugins

const Version = require('./version');


const internals = {};

internals.serverOptions = {
    port: process.env.PORT || 8000
};

internals.customPlugins = [
    { plugin: Version, options: { message: 'lesson2' }}
];

async function init() {

    const server = new Hapi.Server(internals.serverOptions);

    await server.register(internals.customPlugins, { once: true});  // Our custom plugins register only once.

    await server.start();

    console.log('Server startd at: ' + server.info.uri);
    console.log('Server started port:' + server.info.port);
};

init().then(() => {
    
    console.log('post start');
}).catch((err) => {

    // catch failed start up

    console.log('server failed:!!! ' + err);
});
