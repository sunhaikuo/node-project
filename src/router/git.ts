export { }
const express = require('express');
const { execSync } = require('child_process')

const router = express.Router()

function syncGit() {
  execSync(`
            git reset HEAD --hard;
            git clean -fd;
            git pull --force;
            pm2 restart all;
            `, { cwd: __dirname })
  execSync(`
            cd /home/ubuntu/GitHub/flutter/flutter_weibo;
            git reset HEAD --hard;git clean -fd;
            git pull --force;
            cp -r /home/ubuntu/GitHub/flutter/flutter_weibo/build/web /var/www/html;
          `, { cwd: __dirname })
}

router.get('/', (req, res) => {
  syncGit()
  res.send('ok - g3')
})

router.post('/', (req, res) => {
  syncGit()
  res.send('ok - p1')
})

module.exports = router