
/**
 * 前端菜单，自动生成，结构不要手动修改
 * icon、name 等 [值类] 可以随意修改 😎
 */

const menus = [
  {
    "id": "user",
    "name": "user",
    "zh": {
      "name": "用户管理"
    },
    "icon": "user",
    "route": "/user",
    "index": "index.js"
  },
  {
    "id": "order",
    "breadcrumbParentId": "user",
    "name": "order",
    "zh": {
      "name": "order"
    },
    "icon": "menu",
    "route": "/order",
    "index": "index.js"
  }
]

module.exports = { menus }
