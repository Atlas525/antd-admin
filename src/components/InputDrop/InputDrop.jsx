import React from 'react'
import Input from '../Input'
import DropList from '../DropList'
import styles from './InputDrop.less'

class InputDrop extends React.PureComponent {
  static defaultProps = {
    dropList: () => {},
    onOpen: () => {},
    onClose: () => {},
    onChange: () => {},
    onMouseEnter: () => {},
    onMouseLeave: () => {},
    onEnter: () => {},
  }

  constructor(props, ...args) {
    super(props, ...args)

    this.state = {
      visible: false,
      keywords: '',
    }
  }

  handleFocus = () => {
    this.setState(() => ({ visible: true }))
  }

  handleBlur = () => {
    this.setState(() => ({ visible: false }))
  }

  handleChange = ev => {
    const { onChange } = this.props
    const value = ev.target.value // eslint-disable-line

    onChange(value)
    this.setState(() => ({ keywords: value }))
  }

  handleKeyDown = ev => {
    const { onEnter } = this.props
    const { keywords } = this.state
    if (ev.keyCode === 13) {
      onEnter(keywords)
      ev.target.blur()
    }
  }

  render() {
    const {
      dropList,
      onOpen,
      onClose,
      onChange,
      onMouseEnter,
      onMouseLeave,
      onEnter,
      ...inputProps
    } = this.props
    const { keywords = '', visible } = this.state
    const dropListProps = {
      visible,
      keywords,
      dropList,
      onOpen,
      onClose,
      onChange: idx => {
        onChange(dropList[idx])
        this.setState(() => ({ keywords: dropList[idx] }))
      },
      onItemClick: (ev, idx) => {
        onChange(dropList[idx])
        this.setState(() => ({ keywords: dropList[idx] }))
      },
      onMouseEnter,
      onMouseLeave,
    }

    return (
      <div className={styles.inputDrop}>
        <DropList {...dropListProps}>
          <Input
            value={keywords}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            onKeyDown={this.handleKeyDown}
            onChange={this.handleChange}
            {...inputProps}
          />
        </DropList>
      </div>
    )
  }
}

export default InputDrop
