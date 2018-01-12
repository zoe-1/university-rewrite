'use strict';

const Confidence = require('confidence');
const Server = require('./index');
const Fs = require('fs');

const internals = {};

// Confidence Configs

const { Config } = require('./config');
const Store = new Confidence.Store(Config);
const Guid = Confidence.id.generate();
const Criteria = Confidence.id.criteria(Guid);

if (Criteria === null) {
    console.err('Bad id');
    process.exit(1);
}

Criteria.env = 'default';

internals.config = Store.get('/', Criteria);

// Confidence manipulates the certificate key data
// so it breaks tls.  Below is a solution to that issue. 

internals.config.server.tls = {
    key: Fs.readFileSync('./lib/certs/key.key'),
    cert: Fs.readFileSync('./lib/certs/cert.crt'),
    requestCert: false,
    ca: []
};

Server.init(internals.config.server, internals.config.plugins)
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

