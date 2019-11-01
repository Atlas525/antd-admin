/* eslint-disable */
import uuidv4 from 'uuid/v4'

export function uploadFileToOSS({ files, signatureURL }) {
  return new Promise((resolve, reject) => {
    if (Array.isArray(files)) {
      const links = []

      files.forEach(async file => {
        const link = await _uploadFileToOSS({
          file,
          signatureURL,
        })
        links.push(link)
        if (links.length === files.length) {
          resolve(links)
        }
      })
    } else {
      _uploadFileToOSS({
        file: files,
        signatureURL,
      }).then(link => resolve(link))
    }
  })
}

/** upload image to 阿里云 OSS server */
function _uploadFileToOSS({ file, signatureURL, success, failed } = {}) {
  return new Promise(async (resolve, reject) => {
    if (!(file instanceof File)) {
      console.error('非文件')
      reject(`Not a valid file.`)
      failed && failed(`Not a valid file.`)
      return
    }

    let authorizedSignature,
      expired = 30 * 1000, // AliOSS 过期时间，实测 30秒 [原计划计划10分钟]
      sessionField = 'oss-authorized-signature',
      startUpload = ({ accessid, host, policy, signature, code }) => {
        if (code !== '200') {
          console.error(`OSS Token 请求失败`)
          reject(`OSS Token 请求失败`)
          failed && failed(`OSS Token 请求失败`)
          return
        }

        let formData = new FormData(),
          fileName = `${uuidv4() +
            file.name.substr(file.name.lastIndexOf('.'))}`

        formData.append('key', fileName) // 唯一文件名
        formData.append('policy', policy) // policy
        formData.append('OSSAccessKeyId', accessid) // accessKeyId
        formData.append('success_action_status', '200') // 成功后返回的操作码
        formData.append('Signature', signature) // 鉴权签名
        formData.append('file', file)

        /**
         * 图片上传至阿里云 OSS
         * fetch 参考链接 [https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch]
         * http.post(host, formData, { headers: { 'Content-Type': 'multipart/form-data' } }) // 可用
         * @return [注意，没有返回值，code==200就是成功]
         */
        window.fetch(host, { method: 'POST', body: formData }).then(_ => {
          resolve(`${host}/${fileName}`)
          success && success(`${host}/${fileName}`)
        })
      }

    try {
      authorizedSignature =
        JSON.parse(window.sessionStorage.getItem(sessionField)) || {}
    } catch (e) {
      authorizedSignature = {}
    }

    if (
      !authorizedSignature.signature || // 没有签名
      Date.now() - authorizedSignature.timestamp > expired // 签名过期
    ) {
      ajax({
        url: signatureURL,
        success(authorizedSignature) {
          authorizedSignature.timestamp = Date.now()
          window.sessionStorage.setItem(
            sessionField,
            JSON.stringify(authorizedSignature)
          )
          startUpload(authorizedSignature)
        },
      })
    } else {
      startUpload(authorizedSignature)
    }
  })
}

/**
 * 安全的 JSON.parse 😀 [解析失败返回null]
 * @param jsonStr JSON字符串
 */
function JSONparse(jsonStr) {
  let ret = null
  try {
    ret = JSON.parse(jsonStr)
  } catch (e) {
    console.warn('JSON.parse() error\n', e.stack)
  } finally {
    return ret
  }
}

function ajax({ url, success, data, failed, type = 'POST', hearders = {} }) {
  let xhr = new XMLHttpRequest()
  let _url = url

  xhr.onload = () => {
    if (xhr.status === 200 || xhr.status === 304) {
      success(JSONparse(xhr.responseText) || {})
    } else {
      failed(xhr)
    }
  }
  if (type.toUpperCase() === 'GET') {
    let params = []

    for (let k in data) {
      params.push(`${k}=${data[k]}`)
    }
    _url = `${_url}?${params.join('&')}&v=${Date.now()}`
  }
  xhr.open(type, _url)
  for (let k in hearders) {
    xhr.setRequestHeader(k, hearders[k])
  }
  xhr.setRequestHeader('Content-type', 'application/json')
  xhr.send(JSON.stringify(Object.assign({}, data)))
}
