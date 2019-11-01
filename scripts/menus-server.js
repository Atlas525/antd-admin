/* eslint-disable no-console */
const http = require('http')
const { updateMenus } = require('./menus-helper')
const { menusServerPort } = require('../src/utils/config')

function init() {
  http.createServer((req, res) => handleServer(req, res))
    .listen(menusServerPort, () => log(`server run at ${menusServerPort} port`))
}

function handleServer(req, res) {
  let body = ''

  req.on('data', data => body += data)
  req.on('end', async () => {
    let recive = {}

    try {
      recive = JSON.parse(body)
    } catch (e) {
      console.log('[req.end JSON.parse]', e)
    }

    const { cmd, data } = recive

    log(cmd)
    if (cmd === 'get-menus') {
      const menus = await getMenus(req, res)

      handleSuccess({ req, res, data: menus })
    } else if (cmd === 'update-menus') {
      const { menus } = data

      updateMenus(menus)
      handleSuccess({ req, res })
    }
  })
}

function getMenus(req, res) {
  let menus = []

  try {
    menus = require('../config/menus').menus
  } catch (e) {
    console.log('[require menus error]', e)
  }

  Object.keys(require.cache).forEach(id => {
    if (/menus\.js$/.test(id)) {
      delete require.cache[id] // 更新改变后的菜单缓存
    }
  })

  return Promise.resolve(menus)
}

function handleSuccess({ req, res, code = 200, data = null, msg = '' }) {
  res.setHeader('Content-Type', 'text/plain;charset=UTF-8')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.end(JSON.stringify({ code, data, msg }))
}

function log(str) {
  console.log('[scripts/menus-server]', str)
}

module.exports = { init }

//# start from the command line
if ([...process.argv].slice(2)[0] === 'start') init()
