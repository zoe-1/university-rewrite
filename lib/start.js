'use strict';


const Server = require('./index');

// Our custom plugins


// Declare internals

const internals = {};

internals.serverOptions = {
    port: process.env.PORT || 8000
};

Server.init(internals.serverOptions,(server) => {

    console.log('server started' + server.info.uri);
});
