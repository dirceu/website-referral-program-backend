'use strict';

const _             = require('lodash');
const defaultConfig = require('./default.config.js');
/*
 *  Boilerplate: This configuration file will be injected (merged with the default configuration) when running the api locally
 *
 *  All secrets should go under the `secret` section, the rest of configuration params should go under `params`
 *
 */
const config = {
  localPort: 8080,
  secret:    {
    MONGO_URL: 'mongodb://localhost:27017/auth0-api-referral-program'
  },
  param:     {
  }
};

module.exports = () => (_.merge(defaultConfig(), config));
