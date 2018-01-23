'use strict';

const internals = {
    'default': 'resolvers'
};

export const data = [
    {
        type: 'Hapi',
        id: '1000',
        name: 'hapi',
        related: ['1001', '1002', '1003'],
        description: 'A rich framework for building web applications.',
        www_address: 'https://github.com/hapijs/hapi'
    },
    {
        type: 'Hapi',
        id: '1001',
        name: 'http-auth-bearer-token',
        related: ['1000'],
        description: 'Implements auth-bearer-token strategy on hapi servers.',
        www_address: 'https://github.com/johnbrett/hapi-auth-bearer-token'
    },
    {
        type: 'Hapi',
        id: '1002',
        name: 'catbox-policy',
        related: ['1000', '1003'],
        description: 'Configure policies to store and maintain objects in cache.',
        www_address: 'https://github.com/hapijs/catbox'
    },
    {
        type: 'Hapi',
        id: '1003',
        name: 'catbox-redis',
        related: ['1000', '1002'],
        description: 'Implement catbox-policy with redisdb.',
        www_address: 'https://github.com/hapijs/catbox-redis'
    },
    {
        type: 'xHapi',
        id: '1004',
        name: 'browserify',
        related: ['1004' ],
        description: 'bundler',
        www_address: 'http://browserify.org',
        topics: [ '1007', '1008' ]
    },
    {
        type: 'xHapi',
        id: '1005',
        name: 'reactjs',
        related: ['1004', '1006'],
        description: 'user interface builder',
        www_address: 'https://reactjs.org',
        topics: [ '1007', '1008' ]
    },
    {
        type: 'xHapi',
        id: '1006',
        name: 'webpack',
        related: ['1004'],
        description: 'bundler',
        www_address: 'https://webpack.js.org',
        topics: [ '1007', '1008' ]
    },
    {
        type: 'Topic',
        id: '1007',
        name: 'front-end development',
        description: 'none'
    },
    {
        type: 'Topic',
        id: '1008',
        name: 'bundler',
        description: 'none'
    }
];
