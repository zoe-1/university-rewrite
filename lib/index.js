'use strict';


// Load modules

const Hapi = require('hapi');
const Package = require('../package.json');


// Declare internals

const internals = {
    response: {
        version: Package.version
    }
};

// Declare server options 

const serverOptions = {
    port: process.env.PORT || 8000
};


async function init() {

    const server = new Hapi.Server(serverOptions);

    const version = function (request, h) {
    
        return internals.response 
    };

    server.route({ 
        method: 'GET', 
        path: '/version', 
        config: {
            description: 'Returns version of the server.', 
            handler: version
        }
    });

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
