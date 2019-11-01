import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import log from 'utils/console-log'
import DOM from 'utils/dom'
import Animate from 'rc-animate'
import styles from './DropList.less'

const eventType = {
  focus: 'onFocus',
  click: 'onClick',
  hover: 'onMouseEnter',
}

class DropList extends React.PureComponent {
  static defaultProps = {
    header: null,
    visible: false,
    dropList: [],
    trigger: 'hover' || 'click', // 弹出触发方式
    keywords: undefined, // 默认值，匹配高亮 item
    onChange: () => {},
    onOpen: () => {},
    onClose: () => {},
    onItemHover: () => {},
    onItemClick: () => {},
  }

  constructor(props, ...args) {
    super(props, ...args)

    this.el = DOM.createContainer()
    this.wrapElementRef = React.createRef()
    this.state = {
      index: -1,
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

  componentWillUpdate(nextProps, nextState, nextContext) {
    const { keywords, dropList } = nextProps
    this.state.index = dropList.indexOf(keywords)
  }

  componentWillUnmount() {
    if (DOM.getBody().contains(this.el)) {
      DOM.getBody().removeChild(this.el)
    }
    this.setState = () => null
  }

  get component() {
    const { children, trigger, visible } = this.props
    let _children = children
    let _component = this.drop
    let eventName = eventType[trigger]
    if (React.isValidElement(children)) {
      if (children.type.name === 'Input') {
        eventName = eventType.focus

        setTimeout(() => {
          // responded keyboard event
          DOM.getElement().removeEventListener(
            'keydown',
            this.documentKeyboardEvent
          )
          if (visible) {
            DOM.getElement().addEventListener(
              'keydown',
              this.documentKeyboardEvent
            )
          }
        }, 40)
      }
      _children = React.cloneElement(children, {
        ...children.props,
        [eventName]: (...args) => {
          const { target } = args[0]
          const rect = target.getBoundingClientRect()
          const { [eventName]: eventHandle } = children.props

          this.handleAttach(rect)
          eventHandle && eventHandle(...args) // reduction event
        },
      })

      _component = (
        <>
          {_children}
          {ReactDOM.createPortal(this.drop, this.el)}
        </>
      )
    }

    return _component
  }

  get drop() {
    const {
      dropList = [],
      visible,
      onItemHover,
      onItemClick,
      onOpen,
      onClose,
      style,
      className,
      header,
      ...dropProps
    } = this.props
    const { index } = this.state
    const list = dropList.map((item, idx) => {
      return (
        <div
          key={idx}
          onMouseEnter={ev => {
            onItemHover(ev, idx)
          }}
          onClick={ev => {
            onItemClick(ev, idx)
          }}
          className={classNames('drop-list-item', styles.dropListItem, {
            [styles.dropListItemActive]: idx === index,
            [styles.withPadding]: !React.isValidElement(item),
          })}
        >
          {item}
        </div>
      )
    })
    let classJson = {
      [styles.animateOpen]: visible,
      [styles.animateClose]: !visible,
    }
    if (!this.isReenter) {
      classJson = { ...classJson, [styles.displayNone]: !visible }
      this.isReenter = true
    }
    const drop = (
      // Animate 还没用起来 = =! [19-08-29]
      <Animate component="div">
        <div
          data-tag="animate-wrap"
          ref={this.wrapElementRef}
          style={{ ...this.dropStyle, ...style }}
          className={classNames(
            'drop-list-box',
            styles.dropBox,
            className,
            classJson
          )}
          {...dropProps}
        >
          {header && (
            <div
              className={classNames(
                'drop-list-header',
                styles.dropListItemHeader,
                styles.withPadding
              )}
            >
              {header}
            </div>
          )}
          <div className={classNames('drop-list', styles.dropList)}>{list}</div>
        </div>
      </Animate>
    )

    // dom operated
    this.handleAnimate(this.wrapElementRef.current)

    return drop
  }

  // 将元素贴合到目标元素
  handleAttach = rect => {
    if (!DOM.getBody().contains(this.el)) {
      DOM.getBody().appendChild(this.el)
    }

    this.dropStyle = {
      position: 'absolute',
      left: rect.left,
      top: rect.height + rect.top,
      width: rect.width,
    }
  }

  animationCb = ev => {
    ev.preventDefault()

    const { visible } = this.props
    const { target } = ev
    const { current: oWrap } = this.wrapElementRef

    if (target.dataset.tag !== 'animate-wrap') {
      return // 屏蔽冒泡
    }
    if (visible) {
      oWrap.classList.remove(styles.displayNone)
    } else {
      oWrap.classList.add(styles.displayNone)
      this.setState(() => ({ index: -1 }))
    }
  }

  documentKeyboardEvent = ev => {
    if (ev.keyCode < 37 || ev.keyCode > 40) {
      return // without directional key
    }

    const { dropList, onChange } = this.props
    let { index } = this.state

    if (ev.keyCode === 38) {
      // arrow up
      index -= 1
      index = index < 0 ? dropList.length - 1 : index
    } else if (ev.keyCode === 40) {
      // arrow down
      index = (index + 1) % dropList.length
    }
    this.setState(
      () => ({ index }),
      () => {
        onChange(ev, index)
      }
    )
  }

  handleAnimate(el) {
    if (!el) {
      return
    }
    if (this.alreadyEnableAnimate) {
      // performance
      this.alreadyEnableAnimate = true
      return
    }

    el.removeEventListener('animationend', this.animationCb)
    el.addEventListener('animationend', this.animationCb)
  }

  handleVisible() {
    const { visible, onOpen, onClose } = this.props

    visible ? onOpen() : onClose()
  }

  render() {
    const { visible } = this.props

    if (this.preVisible !== visible) {
      this.preVisible = visible
      this.updatedVisible = true

      this.handleVisible()
    } else {
      this.updatedVisible = false
    }

    return this.component
  }
}

export default DropList
