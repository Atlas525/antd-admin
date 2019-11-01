import React, { PureComponent } from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Icon, Switch, Layout, Button } from 'antd'
import { withI18n, Trans } from '@lingui/react'
import { config } from 'utils'
import ScrollBar from '../ScrollBar'
import SiderMenu from './Menu'
import styles from './Sider.less'
import MenusMgr from '../MenuManagment'

@withI18n()
@connect(({ setMenus }) => ({ setMenus }))
class Sider extends PureComponent {
  state = {
    visibleMenusMgr: false,
  }

  isDev = process.env.NODE_ENV === 'development'

  setMenus = () => {
    if (!this.isDev) return

    const { dispatch } = this.props

    // # 获取菜单
    dispatch({ type: 'sideMenus/getMenus' })
    this.setState({ visibleMenusMgr: true })
  }

  get modalProps() {
    const { visibleMenusMgr } = this.state

    return {
      visible: visibleMenusMgr,
      close: () => this.setState({ visibleMenusMgr: false }),
    }
  }

  render() {
    const {
      i18n,
      menus,
      theme,
      isMobile,
      collapsed,
      onThemeChange,
      onCollapseChange,
    } = this.props

    return (
      <Layout.Sider
        width={256}
        theme={theme}
        breakpoint="lg"
        trigger={null}
        collapsible
        collapsed={collapsed}
        onBreakpoint={isMobile ? null : onCollapseChange}
        className={styles.sider}
      >
        <div className={styles.brand}>
          <div className={styles.logo}>
            <img alt="logo" src={config.logoPath} />
            {collapsed ? null : <h1>{config.siteName}</h1>}
          </div>
        </div>

        <div className={styles.menuContainer}>
          <ScrollBar
            options={{
              // Disabled horizontal scrolling, https://github.com/utatti/perfect-scrollbar#options
              suppressScrollX: true,
            }}
          >
            <SiderMenu
              menus={menus}
              theme={theme}
              isMobile={isMobile}
              collapsed={collapsed}
              onCollapseChange={onCollapseChange}
            />
          </ScrollBar>
        </div>
        {collapsed ? null : (
          <div className={styles.switchTheme}>
            <span>
              {/* <Icon type="bulb" />
              <Trans>Switch Theme</Trans>
              <Switch
                onChange={onThemeChange.bind(
                  this,
                  theme === 'dark' ? 'light' : 'dark'
                )}
                defaultChecked={theme === 'dark'}
                checkedChildren={i18n.t`Dark`}
                unCheckedChildren={i18n.t`Light`}
              /> */}
            </span>
            {this.isDev && (
              <span>
                <Button
                  type="ghost"
                  shape="circle-outline"
                  icon="setting"
                  size="small"
                  onClick={this.setMenus}
                />
              </span>
            )}
          </div>
        )}
        <MenusMgr {...this.modalProps} />
      </Layout.Sider>
    )
  }
}

Sider.propTypes = {
  menus: PropTypes.array,
  theme: PropTypes.string,
  isMobile: PropTypes.bool,
  collapsed: PropTypes.bool,
  onThemeChange: PropTypes.func,
  onCollapseChange: PropTypes.func,
}

export default Sider
