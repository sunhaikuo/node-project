#!/bin/bash

scp -r /Users/sunhaikuo/github/node-project/*.js ubuntu@148.70.127.53:/home/ubuntu/node

sh ubuntu@148.70.127.53 "pm2 restart all"