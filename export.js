'use strict';
let fs = require('fs');
let cats = require(`../categories/node_modules/${process.argv[2]}_categories`);

console.log(JSON.stringify(cats))