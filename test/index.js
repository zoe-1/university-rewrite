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

describe('/index', () => {

    it('start up server', async () => {

        const University = require('../lib');

        const server = await University.init('test');

        expect(server).to.be.an.object();
        await server.stop();
    });

    it('fails to generate configs (confidence bad id)', async (done) => {

        const University = require('../lib');

        const Confidence = require('confidence');

        const original = Confidence.id.criteria;

        Confidence.id.criteria = () => {

            Confidence.id.criteria = original;
            return null;
        };

        try {

            await University.init('test');
        }
        catch (err) {

            expect(err.message).to.equal('Confidence Bad id');
        }
    });
});
