'use strict';

const Lab = require('lab');
const Code = require('code');

// Test shortcuts

const lab = exports.lab = Lab.script();
const describe = lab.experiment;
const expect = Code.expect;
const it = lab.test;

// project modules

const internals = {};

describe('/version', () => {

    it('/version success', { parallel: false }, async () => {

        const University = require('../lib');

        const server = await University.init({});

        expect(server).to.be.an.object();

        const request = { method: 'GET', url: '/version', headers: { authorization: 'Bearer 12345678' } };

        const res = await server.inject(request);

        expect(res.result).to.equal('version 1.0.4 lesson4');
        await server.stop();
    });
});
