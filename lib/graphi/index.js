'use strict';

const Graphi = require('graphi');
const Data = require('./dist/schema.js');
const DataNew = require('./dist/newschema.js');


exports.plugin = {
    name: 'graphi-registeration',
    version: '1.0.0',
    description: 'register graphi and build schema.',
    register: async function (server, options) {

        // await Graphi.register(ResolverPlugin, server);
        // const Data = await Graphi.schema(SchemaPlugin, server);

        const schema = await DataNew.get(server, options);

        // console.log('**SCHEMA** ' + JSON.stringify(schema));
        // console.log('**SCHEMA** ' + schema.name + ' ' + schema.message);

        const optionsBuild = {
            schema: schema,
            resolvers: {},
            authStrategy: options.authStrategy,
            grahpiqlPath: options.grahpiqlPath
        };

        await server.register({ plugin: Graphi, options: optionsBuild });
    }
};

// open https://localhost:8000/graphiql?query=%7B%20person(firstname%3A%20%22billy%22)%20%7B%20lastname%20%7D%20%7D&variables=%7B%7D
// curl -k -X POST -H "Content-Type: application/json" -d '{"query":"{person(firstname:\"billy\"){lastname}}"}' https://127.0.0.1:8000/graphql
