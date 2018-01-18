'use strict';

const Lab = require('lab');
const Code = require('code');
const Util = require('util');

// Test shortcuts

const lab = exports.lab = Lab.script();
const describe = lab.experiment;
const expect = Code.expect;
const it = lab.test;


const internals = {};

describe('/user', () => {

    it('succesfully authenticates', { parallel: false }, async () => {

        const University = require('../lib');

        const server = await University.init('test');

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
        await server.stop({ timeout: 0 });
    });

    it('succesfully authenticates, previously registered token returned', { parallel: false }, () => {

        const University = require('../lib');

        const setTimeoutPromise = Util.promisify(setTimeout);

        return setTimeoutPromise(200, 'foobar').then(async (value) => {

            // setTimeoutPromise allows for tokens in rediscache to
            // expire before the next test begins.

            const server = await University.init('test');

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
            await server.stop({ timeout: 0 });
        });
    });

    it('fails to authenticate, bad password', { parallel: false }, async () => {

        const University = require('../lib');

        const server = await University.init('test');

        expect(server).to.be.an.object();

        const request = { method: 'POST', url: '/authenticate', payload: { username: 'foofoo', password: '123478' } };

        const res = await server.inject(request);

        expect(res.result.statusCode).to.equal(401);
        expect(res.result.message).to.equal('invalid credentials');
        await server.stop({ timeout: 0 });
    });

    it('fails to authenticate, bad username', { parallel: false }, async () => {

        const University = require('../lib');

        const server = await University.init('test');

        expect(server).to.be.an.object();

        const request = { method: 'POST', url: '/authenticate', payload: { username: 'tootoo', password: '123478' } };

        const res = await server.inject(request);

        expect(res.result.statusCode).to.equal(401);
        expect(res.result.message).to.equal('invalid credentials');
        await server.stop({ timeout: 0 });
    });
});
