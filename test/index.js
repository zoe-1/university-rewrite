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

    it('start up server', async () => {

        const University = require('../lib');

        const server = await University.init(internals.serverOptions);
        expect(server).to.be.an.object();
        await server.stop();
    });


    it('failed start up', async (done) => {

        const University = require('../lib');

        internals.serverOptions.badKey = 'badthings';

        try {

            await  University.init(internals.serverOptions);
        }
        catch (err) {

            expect(err.message).to.be.a.string().and.contain(['Invalid server options']);
        }
    });
});
