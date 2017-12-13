"use strict";
const merge = require("webpack-merge");
const prodEnv = require("./prod.env");

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  logOptions: {
    // required ['debug', 'info', 'warn', 'error', 'fatal']
    logLevel: '"debug"',
    // optional : defaults to false if not specified
    stringifyArguments: false,
    // optional : defaults to false if not specified
    showLogLevel: true,
    // optional : defaults to false if not specified
    showMethodName: true,
    // optional : defaults to '|' if not specified
    //separator: '"|"',
    // optional : defaults to false if not specified
    showConsoleColors: true
  }
});
