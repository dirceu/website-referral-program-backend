'use strict';

const _             = require('lodash');
const defaultConfig = require('./default.config.js');

/*
 *  Boilerplate: This configuration file will be sent to the Webstask runtime (merged with the default configuration) when creating the webtask
 *
 *  All secrets should go under the `secret` section, the rest of configuration params should go under `params`
 *
 */

const config = {
  webtaskName:  'auth0-api-referral-program',
  webtaskToken: 'eyJhbGciOiJIUzI1NiIsImtpZCI6IjIifQ.eyJqdGkiOiJkOGNiYzVhYWQ2Yjg0NjhiODNiNDNhYWNjZjM2N2Y5NiIsImlhdCI6MTQ1NDQyNzgxOCwiY2EiOlsiNjNjZmM4YzZjNmNiNDM4OWI4MmUxY2RjZDE5MTY0OTgiXSwiZGQiOjEsInRlbiI6Ii9ed3QtcmFtaXJvX3NpbHZleXJhLWF1dGgwX2NvbS1bMC0xXSQvIn0.j8S9-9DSsLlxRzZY-hBhzMeeDuMWHb3XS6N-QssxPZI', // your webtask token goes here, install wt-cli then run wt init and finally wt profile get default

  secret:       {
    MONGO_URL: 'mongodb://localhost:27017/auth0-api-referral-program'
  },
  param:        {
  }
};

module.exports = () => (_.merge(defaultConfig(), config));
