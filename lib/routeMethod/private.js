'use strict';

const internals = {};


exports.Private = function (request, h) {

    return 'privateData';
};

exports.OnPreResponse = function (request, h) {

    const  response = request.response;

    if (
        (response.isBoom) &&
        (response.message === 'Authentication data missing credentials information')
    ) {

        // Attempt was made to access private data with bad credentials

        request.server.log(['authentication', 'error', 'abuse'], 'Authentication data missing credentials information');
    }

    return h.continue;
};
