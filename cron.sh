#!/bin/bash
cd /home/daniel/lottereum
# create weekly deployment file from src code and template
./weekly_deploy.sh > test.js
# send the procedure to geth
geth --exec "loadScript('test.js')" attach

