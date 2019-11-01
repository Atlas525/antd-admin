import service from './service'

export default {
  namespace: 'order',

  state: {
    
  },
  effects: {
    *queryOrderList({ payload = {} }, { call, put }) {
      const data = yield call(service.queryOrderList, payload)
      console.log(data)
      // const { result, success } = data
      // if (success) {
      //   yield put({
      //     type: 'updateState',
      //     payload: {
      //       posonalList: result,
      //     },
      //   })
      // }
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload }
    },
  },
}
