#!/bin/bash
npx tsc
# cp -r src/static build
scp -r ~/github/node-project/build/* root@82.157.162.70:/usr/local/lighthouse/softwares/nodejs/app/

# pm2 start app.js -i 6
ssh root@82.157.162.70 "pm2 restart all"