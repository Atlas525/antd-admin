/**
 * 配合本地开发服务器，图形化管理菜单
 * 只在开发模式可用 ^_^
 */

import { menusServerPort } from '../utils/config'

function request(body) {
  const { protocol, hostname } = window.location
  const host = `${protocol}//${hostname}:${menusServerPort}`
  // console.log(JSON.stringify(body))
  return window
    .fetch(host, {
      method: 'POST',
      body: JSON.stringify(body),
      // {code: 200, data: null, msg: "update successed"}
    })
    .then(res => res.json())
}

export function getMenus() {
  return request({
    cmd: 'get-menus',
  })
}

export function updateMenus(params) {
  return request({
    cmd: 'update-menus',
    data: params,
  })
}
