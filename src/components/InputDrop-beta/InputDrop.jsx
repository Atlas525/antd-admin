import React from 'react'
import log from 'utils/console-log'
import classNames from 'classnames'
import Input from '../Input'
import styles from './InputDrop.less'

class InputDrop extends React.PureComponent {
  constructor(props, ...args) {
    super(props, ...args)

    this.state = {
      dropList: ['---------------', '))))))))))))))))'],
      dropListShow: false,
      dropListIndex: -1,
      keywords: '',
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const { dropList } = nextProps

    if (!Array.isArray(dropList)) {
      log.error(
        `Warning: dropList type is invalid -- expected a Array type but got: ${typeof dropList}. [DropList Component]`
      )
    }
  }

  handleFocus = () => {
    this.setState(() => ({
      dropListIndex: -1,
      dropListShow: true,
    }))
  }

  handleBlur = () => {
    this.setState(() => ({
      dropListIndex: -1,
      dropListShow: false,
    }))
  }

  handleKeyDown = ev => {
    // eslint-disable-next-line
    let { dropList, dropListIndex } = this.state

    switch (ev.keyCode) {
      case 38: // up
        dropListIndex -= 1
        dropListIndex = dropListIndex < 0 ? dropList.length - 1 : dropListIndex
        this.setState(() => ({
          dropListIndex,
          keywords: dropList[dropListIndex],
        }))
        break
      case 40: // down
        dropListIndex = (dropListIndex + 1) % dropList.length
        this.setState(() => ({
          dropListIndex,
          keywords: dropList[dropListIndex],
        }))
        break
      default:
        break
    }
  }

  handleChange = ev => {
    const value = ev.target.value // eslint-disable-line

    this.setState({
      dropListIndex: -1,
      keywords: value,
    })
  }

  handleItemClick = (ev, idx) => {
    this.setState(state => ({
      dropListIndex: -1,
      keywords: state.dropList[idx],
    }))
  }

  render() {
    const { ...inputProps } = this.props
    const { dropList, dropListShow, dropListIndex, keywords } = this.state
    const list = dropList.map((item, idx) => {
      return (
        <div
          key={idx}
          className={classNames('drop-list-item', {
            [styles.dropListShow]: dropListShow,
            [styles.dropListActive]: dropListIndex === idx,
          })}
          onClick={ev => this.handleItemClick(ev, idx)}
        >
          {item}
        </div>
      )
    })

    return (
      <div className={styles.inputDrop}>
        <Input
          value={keywords}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          {...inputProps}
        />
        <div className={styles.dropList}>{list}</div>
      </div>
    )
  }
}

export default InputDrop
