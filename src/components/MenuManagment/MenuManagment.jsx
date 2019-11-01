/* eslint-disable */
import React from 'react'
import { connect } from 'dva'
import { Tree, Input, message } from 'antd'
import { CommonModal, IconFont } from 'components'
import { cloneDeep } from 'lodash'
import './MenuManagment.less'

@connect(({ sideMenus, loading }) => ({ sideMenus, loading }))
class MenuManagment extends React.PureComponent {
  menus = []

  activeMenu = {}

  onSelect = (keys, ev) => {
    const [key] = keys // 取出选中的第一个[单选]
    const [menu = {}] = this.menus.filter(menu => menu.id === key)

    this.activeMenu = menu
    this.forceUpdate()
  }

  get _modalProps() {
    const { close } = this.props

    return {
      centered: true,
      title: 'Menu management',
      onCancel: () => {
        this.activeMenu = {}
        close()
      },
      onOk: async () => {
        const { dispatch } = this.props
        this.menus = this.menus.map(menu =>
          menu.id === this.activeMenu.id ? this.activeMenu : menu
        )
        dispatch({
          type: 'sideMenus/updateMenus',
          payload: { menus: this.menus },
          cb: () => {
            close()
            message.success(`更新菜单成功，请重新登陆 🍺`, 5)
            dispatch({ type: 'app/signOut' }).then(() => {
              // webpack 引入会有缓存，需要重新刷新下
              setTimeout(() => window.location.reload(), 400)
            })
          },
        })
      },
    }
  }

  updateMenu(key, val) {
    const { dispatch } = this.props
    let _key = key
    let _val = val

    if (key === 'name_zh') {
      // 转换 zh 字段格式
      _key = 'zh'
      _val = { name: val }
    }

    this.activeMenu = { ...this.activeMenu, [_key]: _val }

    // # 更新菜单树
    dispatch({
      type: 'sideMenus/updateMenu',
      payload: {
        menu: this.activeMenu,
      },
    })
  }

  render() {
    const {
      sideMenus: { menus = [] },
      ...modalProps
    } = this.props
    const menuTree = generateTree(arrayToTree((this.menus = menus)))
    const { icon, name, zh = {} } = this.activeMenu
    const { name: name_zh } = zh

    return (
      <CommonModal {...modalProps} {...this._modalProps}>
        <Tree.DirectoryTree blockNode defaultExpandAll onSelect={this.onSelect}>
          {menuTree}
        </Tree.DirectoryTree>

        <div className="modal-footer">
          <Input
            addonBefore={<IconFont type={icon || 'loading'} />}
            value={icon}
            onChange={ev => this.updateMenu('icon', ev.target.value)}
          />
          <Input
            addonBefore="中文"
            value={name_zh}
            onChange={ev => this.updateMenu('name_zh', ev.target.value)}
          />
          <Input
            addonBefore="英文"
            value={name}
            onChange={ev => this.updateMenu('name', ev.target.value)}
          />
        </div>
      </CommonModal>
    )
  }
}

export default MenuManagment

function generateTree(menus = []) {
  return menus.map(menu => {
    const opts = {
      key: menu.id,
      title: `${menu.zh.name} | ${menu.name} [${menu.id}]`,
      icon: <IconFont type={menu.icon} />,
    }
    return menu.children ? (
      <Tree.TreeNode {...opts}>{generateTree(menu.children)}</Tree.TreeNode>
    ) : (
      <Tree.TreeNode {...opts} isLeaf />
    )
  })
}

function arrayToTree(
  array = [],
  id = 'id',
  parent = 'menuParentId',
  children = 'children'
) {
  const result = []
  const hash = {}
  const data = cloneDeep(array)

  data.forEach(item => {
    hash[item[id]] = item
  })

  data.forEach(item => {
    const hashParent = hash[item[parent]]
    if (hashParent) {
      !hashParent[children] && (hashParent[children] = [])
      hashParent[children].push(item)
    } else {
      result.push(item)
    }
  })

  return result
}
