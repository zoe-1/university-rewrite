'use strict';

const Graphi = require('graphi');


const schema = `
    type Person {
        firstname: String!
            lastname: String!
    }
    type Query {
        person(firstname: String!): Person!
    }
`;

const getPerson = function (args, request) {

    return new Promise((resolve) => {

        resolve({ firstname: 'billy', lastname: 'jean' });
    });
};

const resolvers = {
    person: getPerson
};


exports.plugin = {
    name: 'graphi-registeration',
    version: '1.0.0',
    description: 'register graphi and build schema.',
    register: async function (server, options) {

        await server.register({ plugin: Graphi, options: { schema, resolvers, authStrategy: options.authStrategy, grahpiqlPath: options.grahpiqlPath } });
    }
};

// open https://localhost:8000/graphiql?query=%7B%20person(firstname%3A%20%22billy%22)%20%7B%20lastname%20%7D%20%7D&variables=%7B%7D
// curl -k -X POST -H "Content-Type: application/json" -d '{"query":"{person(firstname:\"billy\"){lastname}}"}' https://127.0.0.1:8000/graphql
