import React from 'react'
import { EditorState, convertToRaw, ContentState } from 'draft-js' // eslint-disable-line
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import styles from './EditorForm.less'

class DraftEditor extends React.PureComponent {
  state = {
    editorState: EditorState.createEmpty(),
  }

  constructor(props, ...args) {
    super(props, ...args)

    const { value: initialValue } = props

    if (initialValue) {
      const contentBlock = htmlToDraft(initialValue)

      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks
        )
        const editorState = EditorState.createWithContent(contentState)
        this.state = { ...this.state, editorState }
      }
    }
  }

  get editorProps() {
    const {
      'data-__field': dataField,
      'data-__meta': dataMeta,
      onChange,
      value,
      ...editorProps
    } = this.props

    return {
      ...editorProps,
    }
  }

  onEditorStateChange = editorState => {
    // Should provide an event to pass value to Form.
    const { onChange } = this.props
    const content = editorState.getCurrentContent()
    const raw = convertToRaw(content)

    onChange({
      text: content.getPlainText(),
      html: draftToHtml(raw),
      raw,
    })
    this.setState(() => ({ editorState }))
  }

  render() {
    const { editorState } = this.state
    return (
      <Editor
        editorState={editorState}
        // 非受控组件性能会高些不 ^_^
        // initialEditorState={this.editorState} // not work! shite
        toolbarClassName={styles.toolbar}
        wrapperClassName={styles.wrapper}
        editorClassName={styles.editor}
        onEditorStateChange={this.onEditorStateChange}
        {...this.editorProps}
      />
    )
  }
}

/**
 * Custome "Form Component"
 * 1："initialValue" is required, oterwise clicking submit directly will not call validator
 * 2："this.props.onChange" is the interface that is passed back to "Form" value,
 *    at the same time, the value will be passed to the validator by the "Form"
 *
 * Reference link
 * [https://ant.design/components/form-cn/#components-form-demo-customized-form-controls]
 * [https://jpuri.github.io/react-draft-wysiwyg/#/docs]
 */

export default DraftEditor
