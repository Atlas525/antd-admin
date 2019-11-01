import { router, pathMatchRegexp } from 'utils'
import { menus } from 'root/config/menus'
import { homePage } from 'utils/config'
import store from 'store'
// import { loginUser } from './service'
import api from 'api'

const { loginUser } = api

export default {
  namespace: 'login',

  state: {},

  effects: {
    *login(
      {
        payload: { username, password },
      },
      { put, call, select }
    ) {
      const data = yield call(loginUser, { username, password })
      const { locationQuery } = yield select(_ => _.app)
      if (data.success) {
        const { from } = locationQuery
        // ---------------------------
        // # side menu
        store.set('routeList', menus)
        // # side menu 访问权
        store.set('permissions', [])
        // # 用户信息
        store.set('user', { username })
        store.set('isInit', true)
        // ---------------------------
        if (!pathMatchRegexp('/login', from)) {
          if (['', '/'].includes(from)) router.push(`/user`)
          else router.push(from)
        } else {
          router.push(`/user`)
        }
      } else {
        throw data
      }
    },
  },
}
