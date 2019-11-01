import React from 'react'
import store from 'store'
import classNames from 'classnames'
import { Icon } from 'antd'
import DropListLinkage from '../DropListLinkage'
import DropList from './components/DropList'
import DropListItem from './components/DropListITem'
import { SEARCH_HISTORY, MAX_HSITORY, DROP_MODEL } from './constants'
import {} from 'utils'
import styles from './DropListLinkageInput.less'
import stylesItem from './components/DropListItem.less'

let isHoverDropList = false
let dropModel = DROP_MODEL.history
const dropListKeywords = []

function getHistory() {
  const history = store.get(SEARCH_HISTORY)

  return Array.isArray(history) ? history : []
}

function setHistory(item) {
  const history = getHistory(SEARCH_HISTORY)

  if (history.includes(item) || !item) {
    return
  }

  history.push(item)
  history.length > MAX_HSITORY && history.shift()
  store.set(SEARCH_HISTORY, history)
}

class DropListLinkageInput extends React.PureComponent {
  static defaultProps = {
    // 下拉框联动属性
    onChange: () => {},
    selectTree: null,
    selectTag: {},

    // input 属性
    onInputChange: () => {},
    onInputSearch: () => {},
    onDropListItemClick: () => {},

    // 下拉框属性
    inputDropList: null,
  }

  constructor(props, ...args) {
    super(props, ...args)

    const { searchWords = '' } = props

    this.state = {
      searchWords,
      dropVisible: false,
      keywordsIdx: -1,
    }
  }

  componentWillUpdate(nextProps, nextState) {
    const { inputDropList } = nextProps
    let hasPropsError = false

    if (inputDropList && typeof inputDropList === 'object') {
      if (inputDropList.type === DropList) {
        const { children } = inputDropList.props

        if (Array.isArray(children)) {
          if (!children.every(_ => _.type === DropListItem)) {
            hasPropsError = true
            this.logErr(
              `Invalid props "inputDropList -> children -> item", expected "DropListItem"`
            )
          }
          if (children.length > 0) {
            dropModel = DROP_MODEL.keywords
          } else {
            dropModel = DROP_MODEL.history
          }
        } else {
          hasPropsError = true
          this.logErr(
            `Invalid props "inputDropList -> children", expected "Array"`
          )
        }
      } else {
        hasPropsError = true
        this.logErr(`Invalid props "inputDropList", expected "DropList"`)
      }
    } else {
      dropModel = DROP_MODEL.history
    }

    if (hasPropsError) {
      dropModel = DROP_MODEL.history
    }
  }

  get dropListLinkProps() {
    const { selectTag, selectTree, onChange, ...omitted } = this.props

    return {
      selectTag,
      selectTree,
      onChange,
    }
  }

  get dropListNodes() {
    const { inputDropList } = this.props
    const { keywordsIdx } = this.state
    let nodes = null

    if (dropModel === DROP_MODEL.keywords) {
      nodes = this.dropListProcessor(inputDropList)
    } else {
      const history = getHistory()

      nodes = history.length ? (
        <DropList {...this.dropListProps()}>
          {history.map((_, idx) => {
            const itemProps = {
              key: idx,
              className: classNames({
                [stylesItem.dropListItemActive]: keywordsIdx === idx,
              }),
              onClick: ev =>
                this.handleItemClick({
                  ev,
                  idx,
                  type: DROP_MODEL.history,
                  keywords: _,
                }),
            }

            return <DropListItem {...itemProps}>{_}</DropListItem>
          })}
          <div className={styles.clearnWrap}>
            <span
              className={styles.clearnBtn}
              onClick={ev => {
                this.handleClearn(ev)
              }}
            >
              清空历史记录
              <Icon type="delete" className={styles.delIcon} />
            </span>
          </div>
        </DropList>
      ) : null
    }

    return nodes
  }

  dropListProps = () => {
    return {
      onMouseEnter: () => {
        isHoverDropList = true
      },
      onMouseLeave: () => {
        isHoverDropList = false
      },
      onClick: () => {
        isHoverDropList = false
      },
    }
  }

  dropListProcessor = inputDropList => {
    const { keywordsIdx } = this.state
    const {
      children,
      onClick: _onClick,
      onMouseEnter: _onMouseEnter,
      onMouseLeave: _onMouseLeave,
    } = inputDropList.props
    const _this = this

    const items = children.map((ele, idx) => {
      const { props } = ele
      const { onClick: click, children: _children, keywords, className } = props
      let _keywords = ''

      if (typeof _children === 'string') {
        _keywords = _children
      } else if (typeof keywords === 'string') {
        _keywords = keywords
      } else {
        _this.logErr(
          `Invalid props "children or keywords" for set input value, expected string`
        )
      }

      dropListKeywords.push(_keywords) // collection keywords

      // @overwrite
      return React.cloneElement(ele, {
        className: classNames(className, {
          [stylesItem.dropListItemActive]: keywordsIdx === idx,
        }),
        onClick(...args) {
          _this.handleItemClick({
            ev: args[0],
            idx,
            type: DROP_MODEL.keywords,
            keywords: _keywords,
          })
          click instanceof Function && click(...args)
        },
      })
    })

    const list = React.cloneElement(inputDropList, {
      onMouseEnter: (...args) => {
        isHoverDropList = true
        _onClick instanceof Function && _onClick(...args)
      },
      onMouseLeave: (...args) => {
        isHoverDropList = false
        _onMouseEnter instanceof Function && _onMouseEnter(...args)
      },
      onClick: (...args) => {
        isHoverDropList = false
        _onMouseLeave instanceof Function && _onMouseLeave(...args)
      },
    })

    return {
      ...list,
      props: {
        ...list.props,
        children: items,
      },
    }
  }

  handleInputChange = ev => {
    const { target } = ev
    const { value } = target
    const { onInputChange } = this.props

    onInputChange(ev, value)
    this.setState({ searchWords: value })
  }

  handleInputFocus = ev => {
    this.setState({ dropVisible: true, keywordsIdx: -1 })
  }

  handleInputBlur = ev => {
    if (!isHoverDropList) {
      this.setState({ dropVisible: false })
    }
  }

  handleItemClick = ({ ev, idx, keywords, type }) => {
    const { onInputSearch, onDropListItemClick } = this.props

    if (type === DROP_MODEL.history) {
      onInputSearch(keywords)
      onDropListItemClick({ ev, idx, keywords, type })
    }
    setHistory(keywords)
    this.setState(() => ({ searchWords: keywords, dropVisible: false }))
  }

  handleInputKeyUp = ev => {
    const { keyCode, target } = ev
    const { searchWords } = this.state
    const { onInputSearch } = this.props

    if (keyCode === 13) {
      setHistory(searchWords)
      onInputSearch(searchWords)
      target.blur()
    }
  }

  handleInputKeyDown = ev => {
    if (ev.keyCode < 37 || ev.keyCode > 40) {
      return // without directional key
    }

    const { keyCode } = ev
    let { keywordsIdx } = this.state
    let length = 0
    let state = {}

    const historyList = getHistory()
    let children

    if (dropModel === DROP_MODEL.history) {
      length = historyList.length // eslint-disable-line
    } else {
      /* componentWillUpdate 中有做过边界判断，这里可以放心使用 destructuring */
      const { inputDropList } = this.props
      const { props } = inputDropList
      const { children: _children } = props
      children = _children
      length = _children.length // eslint-disable-line
    }

    if (keyCode === 38) {
      keywordsIdx -= 1
      keywordsIdx = keywordsIdx < 0 ? length - 1 : keywordsIdx
    } else if (keyCode === 40) {
      keywordsIdx = (keywordsIdx + 1) % length
    }

    if (dropModel === DROP_MODEL.history) {
      state = { ...state, searchWords: historyList[keywordsIdx] }
    } else {
      state = { ...state, searchWords: dropListKeywords[keywordsIdx] }
    }

    this.setState(() => ({ keywordsIdx, ...state }))
  }

  handleClearn = () => {
    store.remove(SEARCH_HISTORY)
    this.setState(() => ({ dropVisible: false }))
  }

  logErr(str = '') {
    const { inputDropList } = this.props

    console.error(`${str} [DropListLinkageInput]`, '\n', inputDropList)
  }

  render() {
    const { searchWords, dropVisible } = this.state
    const showBorder = dropVisible

    return (
      <div className={styles.wrap}>
        <DropListLinkage {...this.dropListLinkProps} />
        <div
          className={classNames(styles.searchBox, {
            [styles.activated]: showBorder,
          })}
        >
          <input
            className={styles.seartInput}
            value={searchWords}
            onChange={this.handleInputChange}
            onFocus={this.handleInputFocus}
            onBlur={this.handleInputBlur}
            onKeyUp={this.handleInputKeyUp}
            onKeyDown={this.handleInputKeyDown}
          />
          <span className={styles.searchBtn}>搜索</span>
          {dropVisible && this.dropListNodes}
        </div>
      </div>
    )
  }
}

DropListLinkageInput.DropList = DropList
DropListLinkageInput.DropListItem = DropListItem

export default DropListLinkageInput
