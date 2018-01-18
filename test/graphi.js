'use strict';

const { expect } = require('code');
const Lab = require('lab');
const { suite, test } = exports.lab = Lab.script();
const Util = require('util');


suite('/graphi', () => {

    test('search returns name and description values', { parallel: false }, async () => {

        const University = require('../lib');

        const server = await University.init('test');

        expect(server).to.be.an.object();

        const authenticateRequest = { method: 'POST', url: '/authenticate', payload: { username: 'foofoo', password: '12345678' } };

        const authRes = await server.inject(authenticateRequest);

        expect(authRes.result.token.length).to.equal(36);

        const request = {
            method: 'POST',
            url: '/graphql',
            headers: {
                authorization: 'Bearer ' +  authRes.result.token
            },
            payload: {
                query:'{ getRepository (id:\"1003\") { name description } }'
            }
        };

        const res = await server.inject(request);

        expect(JSON.parse(res.payload)).to.equal({
            'data':
            { 'getRepository':
                {
                    'name':  'catbox-redis',
                    'description':  'Implement catbox-policy with redisdb.'
                }
            }
        });

        await server.stop({ timeout: 1 });
    });

    test('search returns name, description and related projects', { parallel: false }, async () => {

        const University = require('../lib');

        const server = await University.init('test');

        expect(server).to.be.an.object();

        const authenticateRequest = { method: 'POST', url: '/authenticate', payload: { username: 'foofoo', password: '12345678' } };

        const authRes = await server.inject(authenticateRequest);

        expect(authRes.result.token.length).to.equal(36);

        const query = '{ getRepository (id:\"1005\") { name description related { name } } }';

        const request = { method: 'POST', url: '/graphql', headers: { authorization: 'Bearer ' +  authRes.result.token }, payload: {  query } };

        const res = await server.inject(request);

        expect(JSON.parse(res.payload)).to.equal({
            'data':
            { 'getRepository':
                {
                    'name':  'reactjs',
                    'description':  'user interface builder',
                    'related': [
                        {
                            'name': 'browserify'
                        },
                        {
                            'name': 'webpack'
                        }
                    ]
                }
            }
        });

        await server.stop({ timeout: 1 });
    });

    test('search returns xHapi type name and topics (inline fragment)', { parallel: false }, async () => {

        const University = require('../lib');

        const server = await University.init('test');

        expect(server).to.be.an.object();

        const authenticateRequest = { method: 'POST', url: '/authenticate', payload: { username: 'foofoo', password: '12345678' } };

        const authRes = await server.inject(authenticateRequest);

        expect(authRes.result.token.length).to.equal(36);

        const query = '{ getRepository (id:\"1005\") { name ' +  // returns a xHapiType
                      '   description                       ' +
                      '     ... on xHapi {                  ' +
                      '         topics {                    ' +
                      '           name                      ' +
                      '         }                           ' +
                      '      }                              ' +
                      '     ... on Hapi {                   ' +
                      '          related {                  ' +
                      '           name                      ' +
                      '         }                           ' +
                      '      }                              ' +
                      '  }                                  ' +
                      '}';

        const request = { method: 'POST', url: '/graphql', headers: { authorization: 'Bearer ' +  authRes.result.token }, payload: {  query } };

        const res = await server.inject(request);

        expect(JSON.parse(res.payload)).to.equal({
            'data':
            { 'getRepository':
                {
                    'name':  'reactjs',
                    'description':  'user interface builder',
                    'topics': [
                        {
                            'name': 'front-end development'
                        },
                        {
                            'name': 'bundler'
                        }
                    ]
                }
            }
        });

        await server.stop({ timeout: 4 });
    });

    test('search returns Hapi type name and related (inline fragment)', { parallel: false }, async () => {

        const University = require('../lib');

        const server = await University.init('test');

        expect(server).to.be.an.object();

        const authenticateRequest = { method: 'POST', url: '/authenticate', payload: { username: 'foofoo', password: '12345678' } };

        const authRes = await server.inject(authenticateRequest);

        expect(authRes.result.token.length).to.equal(36);

        const query = '{ getRepository (id:\"1002\") {      ' +  // returns a HapiType
                      '   name                              ' +
                      '   description                       ' +
                      '     ... on xHapi {                  ' +
                      '         topics {                    ' +
                      '           name                      ' +
                      '         }                           ' +
                      '      }                              ' +
                      '     ... on Hapi {                   ' +
                      '          related {                  ' +
                      '           name                      ' +
                      '         }                           ' +
                      '      }                              ' +
                      '  }                                  ' +
                      '}';

        const request = { method: 'POST', url: '/graphql', headers: { authorization: 'Bearer ' +  authRes.result.token }, payload: {  query } };

        const res = await server.inject(request);

        expect(JSON.parse(res.payload)).to.equal({
            'data':
            { 'getRepository':
                {
                    'name':  'catbox-policy',
                    'description':  'Configure policies to store and maintain objects in cache.',
                    'related': [
                        {
                            'name': 'hapi'
                        },
                        {
                            'name': 'catbox-redis'
                        }
                    ]
                }
            }
        });

        await server.stop({ timeout: 1 });
    });

    test('search fails bad userid', { parallel: false }, () => {

        const University = require('../lib');

        const setTimeoutPromise = Util.promisify(setTimeout);

        return setTimeoutPromise(55).then(async () => { // cache issues this fixed the test

            const server = await University.init('test');

            expect(server).to.be.an.object();

            const authenticateRequest = { method: 'POST', url: '/authenticate', payload: { username: 'foofoo', password: '12345678' } };

            const authRes = await server.inject(authenticateRequest);

            expect(authRes.result.token.length).to.equal(36);

            const request = {
                method: 'POST',
                url: '/graphql',
                headers: {
                    authorization: 'Bearer ' +  authRes.result.token
                },
                payload: {
                    query:'{ getRepository (id:\"xxxx\") { name description } }'
                }
            };

            const res = await server.inject(request);

            expect(JSON.parse(res.payload)).to.equal({
                'data':
                { 'getRepository': null
                }
            });

            await server.stop({ timeout: 2 });
        });
    });

    test('search projects > related_project > and related projects (friends of friends)', async () => {

        const University = require('../lib');

        const server = await University.init('test');

        expect(server).to.be.an.object();


        const authenticateRequest = { method: 'POST', url: '/authenticate', payload: { username: 'foofoo', password: '12345678' } };

        const authRes = await server.inject(authenticateRequest);

        expect(authRes.result.token.length).to.equal(36);

        // const query = '{ getRepository (id:\"1005\") { name description related { name } } }';

        const query = '{ getRepository (id:\"1002\") {      ' +  // returns a HapiType
                      '   name                              ' +
                      '   description                       ' +
                      '     related {                       ' +
                      '       name                          ' +
                      '       related {                     ' +
                      '         name                        ' +
                      '       }                             ' +
                      '     }                               ' +
                      '  }                                  ' +
                      '}';

        const request = { method: 'POST', url: '/graphql', headers: { authorization: 'Bearer ' +  authRes.result.token }, payload: {  query } };

        const res = await server.inject(request);

        expect(JSON.parse(res.payload)).to.equal({
            'data':
            { 'getRepository':
                {
                    'name':  'catbox-policy',
                    'description':  'Configure policies to store and maintain objects in cache.',
                    'related': [
                        {
                            'name': 'hapi',
                            'related': [
                                { 'name': 'http-auth-bearer-token' },
                                { 'name': 'catbox-policy' },
                                { 'name': 'catbox-redis' }
                            ]
                        },
                        {
                            'name': 'catbox-redis',
                            'related': [
                                { 'name': 'hapi' },
                                { 'name': 'catbox-policy' }
                            ]
                        }
                    ]
                }
            }
        });

        await server.stop({ timeout: 4 });
    });

    test('search projects > topics > and topics of related projects (friends of friends)', async () => {

        const University = require('../lib');

        const server = await University.init('test');

        expect(server).to.be.an.object();

        const authenticateRequest = { method: 'POST', url: '/authenticate', payload: { username: 'foofoo', password: '12345678' } };

        const authRes = await server.inject(authenticateRequest);

        expect(authRes.result.token.length).to.equal(36);

        const query = '{ getRepository (id:\"1005\") {      ' +  // returns a xHapiType
                      '   name                              ' +
                      '   description                       ' +
                      '     ... on xHapi {                  ' +
                      '         related {                   ' +
                      '           name                      ' +
                      '           ... on xHapi {            ' +
                      '              topics { name }        ' +
                      '           }                         ' +
                      '         }                           ' +
                      '     }                               ' +
                      '   }                                 ' +
                      '}';

        const request = { method: 'POST', url: '/graphql', headers: { authorization: 'Bearer ' +  authRes.result.token }, payload: {  query } };

        const res = await server.inject(request);

        expect(JSON.parse(res.payload)).to.equal({
            'data':
            { 'getRepository':
                {
                    'name':  'reactjs',
                    'description':  'user interface builder',
                    'related': [
                        {
                            'name': 'browserify',
                            'topics': [
                                { 'name': 'front-end development' },
                                { 'name': 'bundler' }
                            ]
                        },
                        {
                            'name': 'webpack',
                            'topics': [
                                { 'name': 'front-end development' },
                                { 'name': 'bundler' }
                            ]
                        }
                    ]
                }
            }
        });

        await server.stop({ timeout: 1 });
    });
});
