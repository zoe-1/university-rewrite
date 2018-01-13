'use strict';

const internals = {};

// Configuration file is a confidence configuration document.
// * See: https://github.com/hapijs/confidence
// * Confidence added to the project in lesson8.

exports.Config = {
    server: {
        $filter: 'env',
        production: {
            port: 443
        },
        test: {
            debug: false,
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
                        args: ['./log/good_log']
                    }]
                }
            }
        },
        test: {
            authToken: {
                expiresIn: 22
            }
        },
        $default: {
            authToken: {
                expiresIn: ((1000 * 60) * 2)
            },
            good: {
                ops: {
                    interval: 1000
                },
                reporters: {
                    myFileReporter: [{
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
                        args: ['./test/fixtures/awesome_log']
                    }]
                }
            }
        }
    }
};
