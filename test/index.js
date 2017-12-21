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
        // try {
        //
        //     const server = await  University.init(internals.serverOptions);
        //     expect(server).to.be.an.object();
        //     await server.stop();
        // }
        // catch (err) {
        //
        //     expect(err).to.be.null();
        // }

        // University.init(internals.serverOptions, (err, server) => {

        //     expect(err).to.be.null();
        //     expect(server).to.be.an.object();
        //     server.stop();
        // });

        // University.init(internals.serverOptions)
        //     .then((server) => {
        //
        //          expect(server).to.be.an.object();
        //          server.stop();
        //     });
    });


    it('failed start up', async (done) => {

        const University = require('../lib');

        internals.serverOptions.badKey = 'badthings';

        try {

            const server = await  University.init(internals.serverOptions);
        }
        catch (err) {

            expect(err.message).to.be.a.string().and.contain(['Invalid server options']);
        }

        // University.init(internals.serverOptions, (server) => {});
        // expect(() => {

        //     University.init(internals.serverOptions, (err, server) => { });

        // }).to.throw(/AssertionError [ERR_ASSERTION]: Invalid server options { \"port\": 8000, \"routes\": {}, \"badKey\" [1]: \"badthings\" }/);

        // University.init(internals.serverOptions, (err, server) => {

        //     // console.log('GOT IT ' + err);
        //     // expect(err.message).to.be.a.string().and.contain(['callback must be supplied.']);
        //     expect(err.message).to.be.a.string().and.contain(['Invalid server options']);
        // });

        // University.init(internals.serverOptions)
        //     .catch((err) => {
        //
        //         expect(err.message).to.be.a.string().and.contain(['callback must be supplied.']);
        //         delete internals.serverOptions.badKey;
        //     });
    });
});
