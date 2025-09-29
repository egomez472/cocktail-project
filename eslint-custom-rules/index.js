const core = require('./core');
const typescript = require('./typescript');
const angular = require('./angular');
const restrictions = require('./restrictions');
const prettier = require('./prettier');

const allRulesWithMetaData = {
  ...core,
  ...typescript,
  ...angular,
  ...restrictions,
  ...prettier,
};

module.exports = {
  rules: allRulesWithMetaData,
};
