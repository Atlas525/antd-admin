
/**
 * @草鞋没号
 * @param {Object} api umi-plugin-api [https://umijs.org/plugin/develop.html]
 * @param {JSON} opts .umirc.js 中自定义插件配置
 */

export default function (api, opts = {}) {
  if (!opts.disableFrontMenus) {
    //# 是否开启前端生成菜单
    const { menusHelper, menusServer, menusWatcher } = require('./menus')
    menusHelper.init()
    menusServer.init()
    menusWatcher.init()
  }
}
