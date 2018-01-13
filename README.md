# university rewrite


### lesson1

basic hapi server


### lesson2

basic plugin ./version.js


###  lesson3

100% test coverage and .travis.yml


### lesson4

hapi-auth-bearer-token

* add hapi-auth-bearer-token to the application.
* register the auth strategy in it's own plugin './authtoken.js'
* all routes must have valid token to be accessed
  - currently only one route exists.
* adjusted project values to reflect assignment4
* 100% test coverage routes now need a valid token.


###  lesson5

Configuring tls 

* add tls set up to server configuration.


###  lesson6

Using authStragies & prerequisites

* build ./authenticate and ./private points.
* use prerequisite extensions to execute authentication logic.
* Make simple database.js data store to authenticate user records with.
* Apply default authStrategy to ./private point.
* No authStrategy for ./authenticate point.


###  lesson7

catabox-redis

* generate bearer-token upon successful authentication (cryptiles).
* Set bearer-token in catbox-cache along with user record.
* Expire the token after xxxxx time. Set expiresIn: value with
  server.options.
* scopes for user record ['admin', 'member']
* create ./private point which requires admin scope for access.
* pre-empt one user from generating multiple tokens.


###  lesson8
    
confidence

* Build confidence object in ./lib/configs.js
* Configure the object to be filtered by the `env` criteria
* (environment).
The environments will be production, test, default.
  - production: configurations for deployment.
  - test: configs for testing.
  - default: configs for running on local enviroment.
* docs: https://github.com/hapijs/confidence
* TLS and confidence:
  - confidence manipulates the tls certs if they are
    loaded in the Confidence object. To solve the issue
    load tls certs into configs object after confidence
    generates it.


### lesson9

good hapi process monitoring & extending hapi request lifecycle
    
* important: use below to install good or get funky errors.<br/>
  `npm i good@8.0.0-rc1`
* configure good console to write log reports to a logfile.
  Configure confidence file for good to log: test, production, and default.
* Catch invalid attempts to access the ./private route.
  Extend the `onPreResponse` step of the lifecycle for the ./private route.
  So when invalid tokens are used to access ./private, the event is
  logged to the logfile.
* Add `{ debug: false }` config to Confidence file for tests.
  Otherwise, the tests print out hapi-auth-bearer-token error reports.
