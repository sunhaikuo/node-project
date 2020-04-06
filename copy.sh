#!/bin/bash
tsc
cp -r src/static build
scp -r /Users/sunhaikuo/GitHub/node-project/build/* ubuntu@148.70.127.53:/home/ubuntu/node

# pm2 start app.js -i 6
ssh ubuntu@148.70.127.53 "pm2 restart all"