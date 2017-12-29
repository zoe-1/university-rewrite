'use strict';

const Lab = require('lab');
const Code = require('code');
const Fs = require('fs');

// Test shortcuts

const lab = exports.lab = Lab.script();
const describe = lab.experiment;
const expect = Code.expect;
const it = lab.test;

// project modules

const internals = {};

internals.serverOptions = {
    port: null,
    tls: {
        key: Fs.readFileSync('lib/certs/key.key'),
        cert: Fs.readFileSync('lib/certs/cert.crt')
    }
};

describe('/version', () => {

    it('/version success', { parallel: false }, async () => {

        const University = require('../lib');

        const server = await University.init(internals.serverOptions);

        expect(server).to.be.an.object();

        // curl -k -X GET -H "Authorization: Bearer 12345678" https://localhost:8000/version

        const request = { method: 'GET', url: '/version', headers: { authorization: 'Bearer 12345678' } };

        const res = await server.inject(request);

        expect(res.result).to.equal('version 1.0.5 lesson5');
        await server.stop();
    });
});
