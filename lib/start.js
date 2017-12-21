'use strict';


const Server = require('./index');

// Our custom plugins


// Declare internals

const internals = {};

internals.serverOptions = {
    port: process.env.PORT || 8000
};

// Server.init(internals.serverOptions,(err, server) => {
//
//     console.log('server started' + server.info.uri);
// });

const Start = async () => {

    try {

        const server = await  Server.init(internals.serverOptions);

        console.log('starting server ' + server.info.uri);
        // await server.stop();
    }
    catch (err) {

        console.log('WATCHER ' + err);
    }
};

Start();
