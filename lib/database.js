'use strict';

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
        'email': 'foo@hapiu.com',
        'scope': ['admin', 'member']
    },
    {
        'id': 2,
        'username': 'barica',
        'password': 'bar',
        'email': 'bar@hapiu.com',
        'scope': ['member']
    }
];

exports.authenticate = (username, password) => {

    for (const userRecord of internals.db) {

        if (userRecord.username === username) {

            // valid username

            if (userRecord.password === password) {

                delete userRecord.password;

                // authentic user credentials

                const authenticUserRecord = { authentic: true, userRecord };
                return authenticUserRecord;
            }

            const authenticUserRecord = { authentic: false, userRecord: null };
            return authenticUserRecord;
        }
    }

    const authenticUserRecord = { authentic: false, userRecord: null };
    return authenticUserRecord;
};
