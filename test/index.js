'use strict';


const Lab = require('lab');
const Code = require('code');
const Confidence = require('confidence');
const Fs = require('fs');

// Test shortcuts

const lab = exports.lab = Lab.script();
const describe = lab.experiment;
const expect = Code.expect;
const it = lab.test;

// project modules

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


describe('/index', () => {

    it('start up server', async () => {

        const University = require('../lib');

        const server = await University.init(internals.config.server, internals.config.plugins);
        expect(server).to.be.an.object();
        await server.stop();
    });

    it('failed start up', async (done) => {

        const University = require('../lib');

        internals.config.server.badKey = 'badthings';

        try {

            await University.init(internals.config.server, internals.config.plugins);
        }
        catch (err) {

            delete internals.config.server.badKey;
            expect(err.message).to.be.a.string().and.contain(['Invalid server options']);
        }
    });
});
