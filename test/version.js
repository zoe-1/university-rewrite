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

    it('/version success', (done) => {

        const University = require('../lib');

        return University.init(internals.serverOptions, async (server) => {

            expect(server).to.be.an.object();

            const res = await server.inject('/version');

            // console.log('res ' + res);
            expect(res.result).to.equal('version 1.0.0 lesson2');
            server.stop();
        });
    });
});
