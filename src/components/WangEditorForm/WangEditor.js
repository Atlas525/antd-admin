import React, { Component } from 'react'
import Wangeditor from 'wangeditor'
import classNames from 'classnames'
import { uploadFileToOSS } from 'utils/cj-utils'
import { signatureURL } from 'utils/config'
import './index.less'

class WangEditorComp extends Component {
  constructor(props, ...args) {
    super(props, ...args)

    const { value } = props

    this.toolBarStyle = {
      style: {
        textAlign: 'left',
        border: '1px solid #ccc',
      },
    }
    this.editorContinerStyle = {
      style: {
        height: '300px',
        width: '100%',
        border: '1px solid #ccc',
      },
    }
    this.oToolBar = null
    this.oEditContiner = null
    this.editorContent = value || ''
  }

  componentDidMount() {
    const { onChange } = this.props
    const editor = new Wangeditor(this.oToolBar, this.oEditContiner)
    // 设置编辑区域的zindex
    editor.customConfig.zIndex = 0
    // 同步值到 form value
    editor.customConfig.onchange = html => {
      this.editorContent = html
      // fix 内容为空仍返回值的问题
      if (!html.replace(/(<p>)|(<\/p>)|(<br>)/g, '').trim()) {
        this.editorContent = ''
      }

      onChange(this.editorContent)
    }

    // 完全自定义上传图片操作
    editor.customConfig.customUploadImg = async function(files, insert) {
      // files 是 input 中选中的文件列表
      // insert 是获取图片 url 后，插入到编辑器的方法
      const links = await uploadFileToOSS({ files, signatureURL })
      // 上传代码返回结果之后，将图片插入到编辑器中
      links.forEach(imgUrl => {
        insert(imgUrl)
      })
    }

    editor.create()
    this._editor = editor
    this.setValue(this.editorContent) // editor 实例生成后 初始化
  }

  shouldComponentUpdate(nextProps) {
    let update
    const { value } = nextProps

    if (this.editorContent !== value) {
      setTimeout(() => this.setValue(value))
      update = true
    } else {
      // 返回false 避免其他formitem编辑 编辑器重复render会获取焦点
      update = false
    }

    return update
  }

  componentWillUnmount() {
    // 卸载编辑器
    this._editor = null
  }

  setValue = value => {
    this._editor && this._editor.txt.html((this.editorContent = value))
  }

  render() {
    const {
      toolBarStyle: tooStyle,
      continerStyle,
      toolBarClassName,
      continerClassName,
    } = this.props
    const _toolBarStyle = { ...this.toolBarStyle, ...tooStyle }
    const _continerStyle = { ...this.editorContinerStyle, ...continerStyle }

    return (
      <>
        <div
          ref={o => {
            this.oToolBar = o
          }}
          {..._toolBarStyle}
          className={classNames(toolBarClassName)}
        />
        <div
          ref={o => {
            this.oEditContiner = o
          }}
          {..._continerStyle}
          className={classNames(continerClassName)}
        />
      </>
    )
  }
}

export default WangEditorComp
