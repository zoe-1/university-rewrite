'use strict';

const Hoek = require('hoek');

// mock user database

const internals = {};

// @note scopes
// each user record has an array of scopes.
// Scope value determines which routes the user can access.

internals.db = [
    {
        'id': 1,
        'username': 'foofoo',
        'password': '12345678',
        'email': 'foo@hapi.com',
        'scope': ['admin', 'member']
    },
    {
        'id': 2,
        'username': 'barica',
        'password': '12345678',
        'email': 'bar@hapi.com',
        'scope': ['member']
    }
];

exports.authenticate = (username, password) => {

    for (const userRecord of internals.db) {

        if (userRecord.username === username) {

            // valid username

            if (userRecord.password === password) {

                const clonedUser = Hoek.clone(userRecord);

                delete clonedUser.password;

                // authentic user credentials

                const authenticUserCredentials = { authentic: true, userRecord: clonedUser };
                return authenticUserCredentials;
            }

            const invalidUserCredentials = { authentic: false, userRecord: null };
            return invalidUserCredentials;
        }
    }

    const invalidUserCredentials = { authentic: false, userRecord: null };
    return invalidUserCredentials;
};
