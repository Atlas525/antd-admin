/* eslint-disable no-console */
import { getMenus, updateMenus } from 'services/menus'

export default {
  namespace: 'sideMenus',

  state: {
    menus: [],
  },
  effects: {
    *getMenus(_, { call, put, select }) {
      const { code, data, msg } = yield getMenus()

      if (code === 200) {
        yield put({
          type: 'save',
          payload: { menus: data },
        })
      }
    },
    *updateMenus({ payload, cb }, { call, put, select }) {
      const { code, data, msg } = yield updateMenus(payload)

      if (code === 200) {
        cb()
      }
    },
    // # 输入框输入时更新菜单树
    *updateMenu({ payload }, { call, put, select }) {
      const { menu } = payload
      const { menus } = yield select(state => state.sideMenus)

      yield put({
        type: 'save',
        payload: {
          menus: menus.map(_menu => (_menu.id === menu.id ? menu : _menu)),
        },
      })
    },
  },
  reducers: {
    save(state, { payload }) {
      // console.log(payload)

      return { ...state, ...payload }
    },
  },
}
