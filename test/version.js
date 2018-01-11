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

    it('succesfully authenticates', { parallel: false }, async () => {

        const University = require('../lib');

        const server = await University.init(internals.serverOptions);

        expect(server).to.be.an.object();

        // curl -H "Content-Type: application/json" -X POST -d '{"username":"foofoo","password":"12345678"}' https://localhost:8000/authenticate

        const request = { method: 'POST', url: '/authenticate', payload: { username: 'foofoo', password: '12345678' } };

        const res = await server.inject(request);

        expect(res.result.message).to.equal('welcome');
        expect(res.result.token.length).to.equal(8);
        await server.stop();
    });

    it('fails to authenticate, bad password', { parallel: false }, async () => {

        const University = require('../lib');

        const server = await University.init(internals.serverOptions);

        expect(server).to.be.an.object();

        const request = { method: 'POST', url: '/authenticate', payload: { username: 'foofoo', password: '123478' } };

        const res = await server.inject(request);

        expect(res.result.statusCode).to.equal(401);
        expect(res.result.message).to.equal('invalid credentials');
        await server.stop();
    });

    it('fails to authenticate, bad username', { parallel: false }, async () => {

        const University = require('../lib');

        const server = await University.init(internals.serverOptions);

        expect(server).to.be.an.object();

        const request = { method: 'POST', url: '/authenticate', payload: { username: 'tootoo', password: '123478' } };

        const res = await server.inject(request);

        expect(res.result.statusCode).to.equal(401);
        expect(res.result.message).to.equal('invalid credentials');
        await server.stop();
    });

    it('./private success, valid authtoken', async () => {

        const University = require('../lib');

        const server = await University.init(internals.serverOptions);

        expect(server).to.be.an.object();

        // curl -k -X GET -H "Authorization: Bearer 12345678" https://localhost:8000/version

        const request = { method: 'GET', url: '/private', headers: { authorization: 'Bearer 12345678' } };

        const res = await server.inject(request);

        expect(res.result).to.equal('privateData');
        await server.stop();
    });
});


