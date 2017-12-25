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

        const res = await server.inject('/version');

        expect(res.result).to.equal('version 1.0.3 lesson3');
        await server.stop();
    });
});
