import { request } from 'utils'

export default {
  queryOrderList(data) {
    return request({
      url: `order/testOrder/list`,
      method: 'post',
      data
    })
  },
}
