'use strict';

const Server = require('./index');

const internals = {};

Server.init('default')
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

