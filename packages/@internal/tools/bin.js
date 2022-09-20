#!/usr/bin/env node
/* eslint-disable */

const path = require('path');
process.env.TS_NODE_PROJECT = path.resolve(__dirname, './tsconfig.json');
require('ts-node/register');
require('tsconfig-paths');
require('./src');
