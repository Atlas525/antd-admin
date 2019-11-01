/* eslint-disable no-plusplus */
import React, { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Menu } from 'antd'
import { IconFont } from 'components'
import Navlink from 'umi/navlink'
import router from 'umi/router'
import withRouter from 'umi/withRouter'
import {
  arrayToTree,
  queryAncestors,
  pathMatchRegexp,
  addLangPrefix,
  deLangPrefix,
} from 'utils'
import store from 'store'
import classNames from 'classnames'
import styles from './Menu.less'

const { SubMenu } = Menu
let subMenuState = {}

@withRouter // "match", "location", "history", "staticContext"
class SiderMenu extends PureComponent {
  state = {
    openKeys: store.get('openKeys') || [],
  }

  onOpenChange = openKeys => {
    const { menus } = this.props
    const { openKeys: _openKeys } = this.state
    const rootSubmenuKeys = menus.filter(_ => !_.menuParentId).map(_ => _.id)

    const latestOpenKey = openKeys.find(key => _openKeys.indexOf(key) === -1)

    let newOpenKeys = openKeys
    if (rootSubmenuKeys.indexOf(latestOpenKey) !== -1) {
      newOpenKeys = latestOpenKey ? [latestOpenKey] : []
    }

    const { clickIcon, menu } = subMenuState
    const { location, collapsed } = this.props

    if (!collapsed) {
      if (!clickIcon && menu.index) {
        // icon clicked also have index.js(x)
        newOpenKeys = [] // collapse
        if (deLangPrefix(location.pathname) !== menu.route) {
          router.push(addLangPrefix(menu.route))
        }
      }
    }

    this.setState({
      openKeys: newOpenKeys,
    })
    store.set('openKeys', newOpenKeys)
  }

  handleTitleClick = ({ key, domEvent, item }) => {
    const dom = domEvent.currentTarget
    const rect = dom.getBoundingClientRect()
    const clickX = rect.x + rect.width - domEvent.clientX
    const state = { clickIcon: false }

    if (clickX <= 44) {
      // icon clicked
      state.clickIcon = true
    }
    subMenuState = {
      ...subMenuState,
      ...state,
      menu: item,
    }
  }

  generateMenus = data => {
    return data.map(item => {
      if (item.children) {
        return (
          <SubMenu
            onTitleClick={({ key, domEvent }) =>
              this.handleTitleClick({ key, domEvent, item })
            }
            key={item.id}
            title={
              <Fragment>
                {item.icon && <IconFont type={item.icon} />}
                <span>{item.name}</span>
              </Fragment>
            }
          >
            {this.generateMenus(item.children)}
          </SubMenu>
        )
      }
      return (
        <Menu.Item key={item.id}>
          <Navlink to={addLangPrefix(item.route) || '#'}>
            {item.icon && <IconFont type={item.icon} />}
            <span>{item.name}</span>
          </Navlink>
        </Menu.Item>
      )
    })
  }

  render() {
    const {
      collapsed,
      theme,
      menus,
      location,
      isMobile,
      onCollapseChange,
    } = this.props

    // Generating tree-structured data for menu content.
    const menuTree = arrayToTree(menus, 'id', 'menuParentId')

    // 更改匹配规则--增加无菜单的内页的匹配(内页url要继承父级菜单)
    const pathnameArr = location.pathname.split('/')
    let urlElement = ''
    const urlElementArr = []
    // eslint-disable-all no-plusplus
    for (let i = 1; i < pathnameArr.length; i++) {
      urlElement += `/${pathnameArr[i]}`
      urlElementArr.push(urlElement)
    }
    urlElementArr.reverse()

    // Find a menu that matches the pathname.
    let currentMenu
    for (let index = 0; index < urlElementArr.length; index++) {
      currentMenu = menus.find(
        _ => _.route && pathMatchRegexp(_.route, urlElementArr[index])
      )
      if (currentMenu) {
        break
      }
    }

    // Find the key that should be selected according to the current menu.
    const selectedKeys = currentMenu
      ? queryAncestors(menus, currentMenu, 'menuParentId').map(_ => _.id)
      : []

    const { openKeys } = this.state

    const menuProps = collapsed
      ? {}
      : {
          openKeys,
        }

    return (
      <Menu
        mode="inline"
        theme={theme}
        className={classNames({
          [styles.cjMenu]: true,
        })}
        onOpenChange={this.onOpenChange}
        selectedKeys={selectedKeys}
        onClick={
          isMobile
            ? () => {
                onCollapseChange(true)
              }
            : undefined
        }
        {...menuProps}
      >
        {this.generateMenus(menuTree)}
      </Menu>
    )
  }
}

SiderMenu.propTypes = {
  menus: PropTypes.array,
  theme: PropTypes.string,
  isMobile: PropTypes.bool,
  onCollapseChange: PropTypes.func,
}

export default SiderMenu
