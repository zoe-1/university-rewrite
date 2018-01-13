'use strict';

const Lab = require('lab');
const Code = require('code');
const Fs = require('fs');
const Util = require('util');
const Confidence = require('confidence');

// Test shortcuts

const lab = exports.lab = Lab.script();
const describe = lab.experiment;
const expect = Code.expect;
const it = lab.test;


const internals = {};


// Confidence Configs

const { Config } = require('../lib/config');
const Store = new Confidence.Store(Config);
const Guid = Confidence.id.generate();
const Criteria = Confidence.id.criteria(Guid);

if (Criteria === null) {
    console.err('Bad id');
    process.exit(1);
}

Criteria.env = 'test';

internals.config = Store.get('/', Criteria);

internals.config.server.tls = {
    key: Fs.readFileSync('./lib/certs/key.key'),
    cert: Fs.readFileSync('./lib/certs/cert.crt'),
    requestCert: false,
    ca: []
};

describe('/version', () => {

    it('succesfully authenticates', { parallel: false }, async () => {

        const University = require('../lib');

        const server = await University.init(internals.config.server, internals.config.plugins);

        expect(server).to.be.an.object();

        const request = { method: 'POST', url: '/authenticate', payload: { username: 'foofoo', password: '12345678' } };

        const res = await server.inject(request);

        expect(res.result.result).to.equal('welcome');
        expect(res.result.token.length).to.equal(36);

        const request2 = { method: 'POST', url: '/authenticate', payload: { username: 'foofoo', password: '12345678' } };

        const res2 = await server.inject(request2);

        expect(res2.result.message).to.equal('you already registered a token!');
        expect(res2.result.token.length).to.equal(36);
        expect(res2.result.token).to.equal(res.result.token);
        await server.stop({ timeout: 4 });
    });

    it('/version success', async () => {

        const University = require('../lib');

        const server = await University.init(internals.config.server, internals.config.plugins);

        expect(server).to.be.an.object();

        const authenticateRequest = { method: 'POST', url: '/authenticate', payload: { username: 'foofoo', password: '12345678' } };

        const autRes = await server.inject(authenticateRequest);

        expect(autRes.result.result).to.equal('welcome');
        expect(autRes.result.token.length).to.equal(36);


        const request = { method: 'GET', url: '/version', headers: { authorization: 'Bearer ' +  autRes.result.token } };

        const res = await server.inject(request);

        expect(res.result).to.equal('version 1.0.7 lesson7');
        await server.stop({ timeout: 4 });
    });

    it('succesfully authenticates, previously registered token returned', { parallel: false }, () => {

        const University = require('../lib');

        const setTimeoutPromise = Util.promisify(setTimeout);

        return setTimeoutPromise(200, 'foobar').then(async (value) => {

            // setTimeoutPromise allows for tokens in rediscache to
            // expire before the next test begins.

            const server = await University.init(internals.config.server, internals.config.plugins);

            expect(server).to.be.an.object();

            const authenticateRequest = { method: 'POST', url: '/authenticate', payload: { username: 'foofoo', password: '12345678' } };

            const authRes = await server.inject(authenticateRequest);

            expect(authRes.result.result).to.equal('welcome');
            expect(authRes.result.message).to.equal('successful authentication');
            expect(authRes.result.token.length).to.equal(36);

            const request = { method: 'POST', url: '/authenticate', payload: { username: 'foofoo', password: '12345678' } };

            const res = await server.inject(request);

            expect(res.result.message).to.equal('you already registered a token!');
            expect(res.result.token.length).to.equal(36);
            await server.stop({ timeout: 4 });
        });
    });

    it('fails to authenticate, bad password', { parallel: false }, async () => {

        const University = require('../lib');

        const server = await University.init(internals.config.server, internals.config.plugins);

        expect(server).to.be.an.object();

        const request = { method: 'POST', url: '/authenticate', payload: { username: 'foofoo', password: '123478' } };

        const res = await server.inject(request);

        expect(res.result.statusCode).to.equal(401);
        expect(res.result.message).to.equal('invalid credentials');
        await server.stop({ timeout: 4 });
    });

    it('fails to authenticate, bad username', { parallel: false }, async () => {

        const University = require('../lib');

        const server = await University.init(internals.config.server, internals.config.plugins);

        expect(server).to.be.an.object();

        const request = { method: 'POST', url: '/authenticate', payload: { username: 'tootoo', password: '123478' } };

        const res = await server.inject(request);

        expect(res.result.statusCode).to.equal(401);
        expect(res.result.message).to.equal('invalid credentials');
        await server.stop({ timeout: 4 });
    });

    it('./private success, valid authtoken', () => {

        const University = require('../lib');

        const setTimeoutPromise = Util.promisify(setTimeout);

        return setTimeoutPromise(150).then(async () => {

            const server = await University.init(internals.config.server, internals.config.plugins);

            expect(server).to.be.an.object();

            const authenticateRequest = { method: 'POST', url: '/authenticate', payload: { username: 'foofoo', password: '12345678' } };

            const authRes = await server.inject(authenticateRequest);

            expect(authRes.result.result).to.equal('welcome');
            expect(authRes.result.message).to.equal('successful authentication');
            expect(authRes.result.token.length).to.equal(36);

            const request = { method: 'GET', url: '/private', headers: { authorization: 'Bearer ' + authRes.result.token } };

            const res = await server.inject(request);

            expect(res.result).to.equal('privateData');
            await server.stop({ timeout: 4 });
        });
    });

    it('fails to access ./private. good server.log reports.', () => {

        const University = require('../lib');


        const setTimeoutPromise = Util.promisify(setTimeout);

        return setTimeoutPromise(150).then(async () => {

            const server = await University.init(internals.config.server, internals.config.plugins);

            expect(server).to.be.an.object();

            server.events.on('log', (event, tags) => {

                if (tags.error) {
                    expect(tags.authentication).to.equal(true);
                    expect(tags.abuse).to.equal(true);
                    expect(event.data).to.equal('Authentication data missing credentials information');
                }
            });

            // http-auth-bearer-token creates a console error repsponse.
            // It prints out to the console. Turn these console reports off by setting `debug: false` (./lib/config.js)

            const request = { method: 'GET', url: '/private', headers: { authorization: 'Bearer ' + 'badToken' } };

            const res = await server.inject(request);

            expect(res.result.statusCode).to.equal(500);
            expect(res.result.error).to.equal('Internal Server Error');

            await server.stop({ timeout: 4 });
        });
    });

    it('denies non-admin user access to ./private route', () => {

        const University = require('../lib');


        const setTimeoutPromise = Util.promisify(setTimeout);

        return setTimeoutPromise(150).then(async () => {

            const server = await University.init(internals.config.server, internals.config.plugins);

            expect(server).to.be.an.object();

            const authenticateRequest = { method: 'POST', url: '/authenticate', payload: { username: 'barica', password: '12345678' } };

            const authRes = await server.inject(authenticateRequest);

            expect(authRes.result.result).to.equal('welcome');
            expect(authRes.result.message).to.equal('successful authentication');
            expect(authRes.result.token.length).to.equal(36);

            const request = { method: 'GET', url: '/private', headers: { authorization: 'Bearer ' + authRes.result.token } };

            const res = await server.inject(request);

            expect(res.result.statusCode).to.equal(403);
            expect(res.result.message).to.equal('Insufficient scope');
            expect(res.result.error).to.equal('Forbidden');

            await server.stop({ timeout: 4 });
        });
    });
});

// curl -H "Authorization: Bearer 12345678" -X GET https://localhost:8000/private
// curl -k -X GET -H "Authorization: Bearer 12345678" https://localhost:8000/version
// curl -H "Authorization: Bearer 12345678" -X GET https://localhost:8000/private
// curl -k -X GET -H "Authorization: Bearer 12345678" https://localhost:8000/version
// curl -k -H "Content-Type: application/json" -X POST -d '{"username":"foofoo","password":"12345678"}' https://localhost:8000/authenticate
// curl -k -X GET -H "Authorization: Bearer 12345678" https://localhost:8000/version
