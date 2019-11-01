/* eslint-disable no-console */
const fs = require('fs')
const path = require('path')
const menusHelper = require('./menus-helper')

function init() {
  try {
    const filename = path.join(__dirname, '../src/pages/.umi/router.js')

    fs.watchFile(filename, (curr, prev) => {
      log('rebuild menus')
      menusHelper.init()
    })
  } catch (e) {
    console.log('读取 .umi/router.js 报错', e)
  }
}

function log(str) {
  console.log('[scripts/menus-watcher]', str)
}


module.exports = { init }

//# start from the command line
if ([...process.argv].slice(2)[0] === 'start') init()
