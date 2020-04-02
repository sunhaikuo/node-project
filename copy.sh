#!/bin/bash
tsc
scp -r /Users/sunhaikuo/GitHub/node-project/build/* ubuntu@148.70.127.53:/home/ubuntu/node

ssh ubuntu@148.70.127.53 "pm2 restart all"