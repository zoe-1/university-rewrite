'use strict';

const internals = {};

// Configuration file is a confidence configuration document.
// * See: https://github.com/hapijs/confidence
// * Confidence added to the project in lesson8.

exports.Config = {
    server: {
        $filter: 'env',
        production: {
            debug: false,
            port: 443
        },
        test: {
            debug: false,
            port: 8000
        },
        $default: {
            debug: false,
            port: 8000
        }
    },
    plugins: {
        authToken: {
            $filter: 'env',
            production: {
                expiresIn: 6000
            },
            test: {
                expiresIn: 22
            },
            $default: {
                expiresIn: ((1000 * 60) * 2)
            }
        },
        good: {
            ops: {
                interval: 1000
            },
            reporters: {
                file: [{
                    module: 'good-squeeze',
                    name: 'Squeeze',
                    args: [{ ops: '*',  log: '*', response: '*', error: '*' }]
                }, {
                    module: 'good-squeeze',
                    name: 'SafeJson',
                    args: [
                        null,
                        { seperator: ',' }
                    ]
                }, {
                    module: 'good-file',
                    args: {
                        $filter: 'env',
                        production: ['./log/good_log'],
                        test: ['./test/fixtures/awesome_log'],
                        $default: ['./test/fixtures/awesome_log']
                    }
                }]
            }
        }
    }
};
