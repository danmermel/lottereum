#!/bin/bash

# strip comments from the Solidity source
drawstr=`cat draw11.sol | sed 's/\/\/.*//g' | tr  '\n' ' '`
lottereostr=`cat lottereo.sol | sed 's/\/\/.*//g' | tr  '\n' ' '`

# put the source into the template JavaScript
DRAWSRC="$drawstr" LOTTSRC="$lottereostr" envsubst < weekly_deploy_template.js


