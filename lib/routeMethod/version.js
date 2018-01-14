'use strict';

const Package = require('../../package.json');

const internals = {};

exports.Version = function (request, h) {

    return 'version ' + Package.version;
};
