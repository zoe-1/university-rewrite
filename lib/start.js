'use strict';


const Server = require('./index');

// Our custom plugins


// Declare internals

const internals = {};

internals.serverOptions = {
    port: process.env.PORT || 8000
};

Server.init(internals.serverOptions)
    .then((server) => {

        console.log('Server started: ' + server.info.uri);
    })
    .catch((err) => {

        console.log('Error: ' + err);
    });

// @option async style
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

