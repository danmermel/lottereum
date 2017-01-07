#!/usr/bin/env node

var argv = process.argv.slice(2);
if (argv.length == 0) {
  console.error("Usage: ./strip.js <x.sol>");
  process.exit(1);
}

var fs = require('fs');
var templatefile = "./template.js";
var template = fs.readFileSync(templatefile, "utf8");

// load Solidity source and strip it
var src = fs.readFileSync(argv[0], "utf8");
lines = src.split("\n");
var newlines = [];
for(var i in lines) {
  if(!lines[i].match(/ *\/\//)) {
    newlines.push(lines[i]);
  }
}
src = newlines.join(" ").trim();

console.log(src);
