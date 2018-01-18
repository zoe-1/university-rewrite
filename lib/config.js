'use strict';

const Fs = require('fs');
const Confidence = require('confidence');
const Boom = require('boom');

const internals = {};

// Configuration file is a confidence configuration document.
// * See: https://github.com/hapijs/confidence
// * Confidence added to the project in lesson8.

internals.config = {
    server: {
        $filter: 'env',
        production: {
            debug: false,
            port: 443
        },
        test: {
            debug: false,
            port: 0
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
                expiresIn: 19
            },
            $default: {
                expiresIn: ((1000 * 60) * 1)
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
        },
        graphi: {
            $filter: 'env',
            production: {
                graphiqlPath: false,
                authStrategy: 'default'
            },
            test: {
                graphiqlPath: false,
                authStrategy: 'default'
            },
            $default: {
                authStrategy: false,        // @todo beef up graphi's validations.
                graphiqlPath: './graphqli'
            }
        }
    }
};

const Store = new Confidence.Store(internals.config);
const Guid = Confidence.id.generate();

exports.get = function (environment) {

    return new Promise((resolve, reject) => {

        const Criteria = Confidence.id.criteria(Guid);

        if (Criteria === null) {
            return reject(Boom.internal('Confidence Bad id'));
        }

        Criteria.env = environment;

        const config = Store.get('/', Criteria);

        // Confidence manipulates the certificate key data
        // so it breaks tls.  Below is a solution to that issue.

        config.server.tls = {
            key: Fs.readFileSync('./lib/certs/key.key'),
            cert: Fs.readFileSync('./lib/certs/cert.crt'),
            requestCert: false,
            ca: []
        };

        return resolve(config);
    });
};
