const {buildGraph, buildBundle} = require('../src/bundler');
const fs = require('fs');
const graph = buildGraph('./files/index.js');
const res = buildBundle(graph);
fs.writeFileSync('./dist/bundle.js', res);
console.log(res);
