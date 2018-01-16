'use strict';

const { expect } = require('code');
const Lab = require('lab');
const { suite, test } = exports.lab = Lab.script();


suite('graphi development', () => {

    test('search returns name and description values', async () => {

        const University = require('../lib');

        const server = await University.init('test');

        expect(server).to.be.an.object();

        const authenticateRequest = { method: 'POST', url: '/authenticate', payload: { username: 'foofoo', password: '12345678' } };

        const authRes = await server.inject(authenticateRequest);

        expect(authRes.result.token.length).to.equal(36);

        const request = { method: 'POST', url: '/graphql', headers: { authorization: 'Bearer ' +  authRes.result.token }, payload: { query:'{ hapi (id:\"1003\") { name description } }' } };

        const res = await server.inject(request);

        expect(JSON.parse(res.payload)).to.equal({
            'data':
            { 'hapi':
                {
                    'name':  'catbox-redis',
                    'description':  'Implement catbox-policy with redisdb.'
                }
            }
        });

        await server.stop({ timeout: 4 });
    });

    test('search returns name, description and related projects', async () => {

        const University = require('../lib');

        const server = await University.init('test');

        expect(server).to.be.an.object();

        const authenticateRequest = { method: 'POST', url: '/authenticate', payload: { username: 'foofoo', password: '12345678' } };

        const authRes = await server.inject(authenticateRequest);

        expect(authRes.result.token.length).to.equal(36);

        const query = '{ hapi (id:\"1003\") { name description related { name } } }';
        const request = { method: 'POST', url: '/graphql', headers: { authorization: 'Bearer ' +  authRes.result.token }, payload: {  query } };

        const res = await server.inject(request);

        expect(JSON.parse(res.payload)).to.equal({
            'data':
            { 'hapi':
                {
                    'name':  'catbox-redis',
                    'description':  'Implement catbox-policy with redisdb.',
                    'related': [
                        {
                            'name': 'hapi'
                        },
                        {
                            'name': 'catbox-policy'
                        }
                    ]
                }
            }
        });

        await server.stop({ timeout: 4 });
    });
});
