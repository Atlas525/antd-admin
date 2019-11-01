/* eslint-disable no-console,camelcase,spaced-comment */
const { writeFileSync, statSync, readdirSync } = require('fs')
const { join } = require('path')
const { homePage = 'user' } = require('../src/utils/config')

const pagePath = '../src/pages'
const outputPath = join(__dirname, '../config/menus.js')
const separator = '>'

const excludes = [
  '.umi',
  'login',
  'config',
  'components',
  'layouts',
  'models',
  'locales',
  'services',
  'utils',
  'plugins',
  'themes',
]
const menu = {
  id: '',
  menuParentId: '',
  breadcrumbParentId: '',
  name: '',
  zh: {
    name: ''
  },
  icon: 'menu',
  route: '',
}

function dirsFilter(path, dirs) {
  return dirs.filter(dir => {
    let bool = true
    const _path = join(path, dir)
    const stat = statSync(_path)

    if (excludes.includes(dir)) bool = false    // umi 约定的文件夹
    if (/\$+/g.test(dir)) bool = false          // 动态路由文件夹
    if (stat.isDirectory()) {
      const _dirs = readdirSync(_path)

      if (!_dirs.length) {
        bool = false                            // 空文件夹
      } else if (
        _dirs.length === 1              //- 只函有一项
        &&
        _dirs[0].includes('.js')        //- 文件是 .js(x) 文件
        &&
        !/index\.js(x)?/.test(_dirs[0]) //- 是 index.js(x) 文件
      ) {
        bool = false                            // 未包含入口文件
      }
    } else {
      bool = false                              // 非文件夹
    }

    return bool
  })
}

/**
 * path level
 */

function path2Level() {
  const res = []
  const readdir = (root = '') => {
    const _path = join(__dirname, pagePath, root)
    const dirs = dirsFilter(_path, readdirSync(_path))

    dirs.map(dir => readdir(join(root, dir)))
    root // 去除第一次调用时的空白路径
    &&
    res.push(root.replace(/\\|\//g, separator)) // 用 separator 链接层级关系
  }
  readdir()

  return res
}


/**
 * menus tree
 */

function path2Tree(root = '') {
  const arr = []
  const path = join(__dirname, pagePath, root)
  const dirs = readdirSync(path).filter(_ => !excludes.includes(_))

  dirs.forEach(dir => {
    const stat = statSync(join(path, dir))
    let tmp = { name: dir, type: 'file' }

    if (stat.isDirectory()) {
      tmp = {
        ...tmp,
        type: 'directory',
        dirs: path2Tree(join(root, dir)),
      }
    }
    arr.push(tmp)
  })

  return arr
}

function mergeMneus({ menus_old = [], menus_new = [] }) {
  const menu_exist = []

  menus_new.forEach(menu_n => {
    const tmp = menus_old.find(menu_o => menu_n.id === menu_o.id)

    tmp && menu_exist.push(tmp)
  })

  const menus_new_old = menus_new.map(menu_n => {
    let _meun = menu_n
    const idx = menu_exist.findIndex(menu_e => menu_e.id === menu_n.id)

    if (idx > -1) {
      _meun = menu_exist[idx]   // 保留原来 menu
      // _meun = { ..._meun, ...menu_exist[idx] } // 19-08-10 新增 index.js(x) 标识
      menu_exist.splice(idx, 1) // 移除已经替换的 menu
    }

    return _meun
  })

  return menus_new_old
}

function writeMenus(menus) {
  const data = `
/**
 * 前端菜单，自动生成，结构不要手动修改
 * icon、name 等 [值类] 可以随意修改 😎
 */

const menus = ${JSON.stringify(menus, null, 2)}

module.exports = { menus }
`

  writeFileSync(outputPath, data)
}

function path2menu(path, sep = separator) {
  const arr = path.split(sep)
  const upperPath = arr.length > 1
    ? arr.filter((_, idx) => idx !== arr.length - 1) // 去掉自己
    : undefined
  const fullpath = join(__dirname, pagePath, ...arr)
  const dirs = readdirSync(fullpath)
  const index = dirs.find(_ => /index.js(x)?/.test(_))
  const menuParentId =Array.isArray(upperPath) ? upperPath.join(sep) : undefined

  /**
   * menuParentId       -> used for Side Menus
   * breadcrumbParentId -> used for breadcrumb navigate
   */

  return {
    ...menu,
    id: path,
    index,
    menuParentId,
    breadcrumbParentId: Array.isArray(upperPath) // eslint-disable-line
      //# 取得上一层做面包屑
      ? upperPath[upperPath.length - 1] // menuParentId // 19-08-26 fix bread generate bug ^_^
      //# 过滤掉自己，不然生成面包屑会出现死循环
      : path === homePage ? undefined : homePage,
    name: arr[arr.length - 1],
    zh: {
      name: arr[arr.length - 1]
    },
    route: `/${arr.join('/')}`
  }
}

function equalsArr(arr1 = [], arr2 = [], key = 'id') {
  let bool

  if (arr1.length !== arr2.length) {
    bool = false
  } else {
    bool = arr1.every(o1 => arr2.find(o2 => o1[key] === o2[key]))
  }

  return bool
}

function updateMenus(menus) {
  writeMenus(menus)
  log('已更新 menus')
}

function init() {
  //# test
  const pathTree = path2Tree()
  const pathLevel = path2Level()

  // writeFileSync(join(__dirname, 'test/menus-tree.json'), JSON.stringify(pathTree, null, 2))
  // writeFileSync(join(__dirname, 'test/path-level.json'), JSON.stringify(pathLevel, null, 2))
  //# test

  const { menus: menus_old } = require('../config/menus')
  Object.keys(require.cache).forEach(id => {
    if (/menus\.js$/.test(id)) {
      delete require.cache[id] // 更新改变后的菜单缓存
    }
  })
  const menus_new = path2Level().map(path => path2menu(path))

  // console.log(menus_new.length, menus_old.length)

  if (equalsArr(menus_new, menus_old)) {
    log('nothing changed')
  } else {
    writeMenus(mergeMneus({ menus_old, menus_new }).reverse())
    log('已生成 menus')
  }
}

function log(str) {
  console.log('[scripts/menus-helper]', str)
}

module.exports = {
  init,
  updateMenus,
}

//# start from the command line
if ([...process.argv].slice(2)[0] === 'start') init()
