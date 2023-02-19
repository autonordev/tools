const prettierConfigStandard = require("prettier-config-standard");
const merge = require("lodash/merge");

const modifiedConfig = merge({}, prettierConfigStandard, {
  plugins: ["prettier-plugin-packagejson", "prettier-plugin-sh"],
  pluginSearchDirs: ["./node_modules"],
});

module.exports = modifiedConfig;
