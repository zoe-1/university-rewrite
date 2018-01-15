'use strict';

const { expect } = require('code');
const Lab = require('lab');
const { suite, test } = exports.lab = Lab.script();


suite('graphi development', () => {

    test('search returns last name', async () => {

        const University = require('../lib');

        const server = await University.init('test');

        expect(server).to.be.an.object();

        const authenticateRequest = { method: 'POST', url: '/authenticate', payload: { username: 'foofoo', password: '12345678' } };

        const authRes = await server.inject(authenticateRequest);

        expect(authRes.result.token.length).to.equal(36);

        const request = { method: 'POST', url: '/graphql', headers: { authorization: 'Bearer ' +  authRes.result.token }, payload: { query:'{person(firstname:\"billy\"){lastname}}' } };

        const res = await server.inject(request);

        expect(JSON.parse(res.payload)).to.equal({
            'data':
                { 'person':
                    { 'lastname': 'jean' }
                }
        });

        await server.stop({ timeout: 4 });
    });
});
