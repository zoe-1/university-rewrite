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

// server options

internals.serverOptions = {
    port: process.env.PORT || 8000
};


describe('/version', () => {

    it('/version success', { parallel: false }, async () => {

        const University = require('../lib');

        const server = await University.init(internals.serverOptions);

        expect(server).to.be.an.object();

        const res = await server.inject('/version');

        expect(res.result).to.equal('version 1.0.0 lesson2');
        await server.stop();
    });
});
