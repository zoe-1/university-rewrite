'use strict';


const Server = require('./index');
const Fs = require('fs');

// Our custom plugins


// Declare internals

const internals = {};

internals.serverOptions = {
    port: process.env.PORT || 8000,
    tls: {
        key: Fs.readFileSync('lib/certs/key.key'),
        cert: Fs.readFileSync('lib/certs/cert.crt')
    }
};

Server.init(internals.serverOptions)
    .then((server) => {

        console.log('Server started: ' + server.info.uri);
    })
    .catch((err) => {

        console.log('Error: ' + err);
    });

// optional async style
// const Start = async () => {
//
//     // try {
//
//     //     const server = await  Server.init(internals.serverOptions);
//
//     //     console.log('starting server ' + server.info.uri);
//     //     // await server.stop();
//     // }
//     // catch (err) {
//
//     //     console.log('WATCHER ' + err);
//     // }
//
//
// };
//
// Start();

