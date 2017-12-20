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

describe('/index', () => {

    it('start up server', () => {

        const University = require('../lib');

        University.init(internals.serverOptions, (server) => {

            expect(server).to.be.an.object();
            server.stop();
        });
    });


    it('failed start up', (done) => {

        const University = require('../lib');

        internals.serverOptions.badKey = 'badthings';

        University.init(internals.serverOptions).catch((err) => {

            expect(err.message).to.be.a.string().and.contain(['\"badKey\" is not allowed']);
            delete internals.serverOptions.badKey;
        });
    });
});
