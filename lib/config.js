'use strict';

const internals = {};


exports.Config = {
    server: {
        $filter: 'env',
        production: {
            port: 443
        },
        test: {
            port: 8000
        },
        $default: {
            port: 8000
        }
    },
    plugins: {
        $filter: 'env',
        production: {
            authToken: {
                expiresIn: 6000
            }
        },
        test: {
            authToken: {
                expiresIn: 50
            }
        },
        $default: {
            authToken: {
                expiresIn: ((1000 * 60) * 2)
            }
        }
    }
};
