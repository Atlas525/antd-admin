import axios from 'axios'
import { cloneDeep, isEmpty } from 'lodash'
import pathToRegexp from 'path-to-regexp'
import { message } from 'antd'
import { CANCEL_REQUEST_MESSAGE } from 'utils/constant'

const { CancelToken } = axios
// eslint-disable-next-line compat/compat
window.cancelRequest = new Map()

export default function request(options) {
  let { url } = options
  const { data, method = 'get' } = options
  const cloneData = cloneDeep(data)

  try {
    let domain = ''
    const urlMatch = url.match(/[a-zA-z]+:\/\/[^/]*/)
    if (urlMatch) {
      ;[domain] = urlMatch
      url = url.slice(domain.length)
    }

    const match = pathToRegexp.parse(url)
    url = pathToRegexp.compile(url)(data)

    for (const item of match) {
      if (item instanceof Object && item.name in cloneData) {
        delete cloneData[item.name]
      }
    }
    url = domain + url
  } catch (e) {
    message.error(e.message)
  }

  options.headers = options.headers || {
    'Content-Type': 'application/json;charset=UTF-8',
    token: sessionStorage.getItem('loginToken') || '',
    // token:'c15c0dee-31e1-4331-8ad6-8ec40bc6fa8f'
  }
  options.url = url
  options.method = method
  if (options.method.toUpperCase() === 'GET') {
    options.params = cloneData || {}
    delete options.data
  } else {
    options.data = cloneData || {}
  }
  options.cancelToken = new CancelToken(cancel => {
    window.cancelRequest.set(Symbol(Date.now()), {
      pathname: window.location.pathname,
      cancel,
    })
  })
  return axios(options)
    .then(response => {
      const { statusText, status, data: dataRp } = response
      let success = false
      if (dataRp.code >= 200 && dataRp.code < 300) {
        success = true
      }
      return Promise.resolve({
        success,
        message: dataRp.error ? dataRp.error : statusText,
        code: dataRp.code ? dataRp.code : status,
        result: dataRp.data ? dataRp.data : null,
      })
    })
    .catch(error => {
      const { response, message: messageRp } = error

      if (String(messageRp) === CANCEL_REQUEST_MESSAGE) {
        return {
          success: false,
          code: 500,
          message: '取消发送请求',
          result: null,
        }
      }

      let msg
      let statusCode

      if (response && response instanceof Object) {
        const { data: dataRpcat, statusText } = response
        statusCode = response.status
        msg = dataRpcat.message || statusText
      } else {
        statusCode = 600
        msg = error.message || 'Network Error'
      }

      /* eslint-disable */
      return Promise.reject({
        success: false,
        code: statusCode,
        message: msg,
        result: null,
      })
    })
}
