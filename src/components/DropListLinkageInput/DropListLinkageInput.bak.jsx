import React from 'react'
import store from 'store'
import classNames from 'classnames'
import { Icon } from 'antd'
import { getElement } from 'utils/dom'
import DropListLinkage from '../DropListLinkage'
import DropList from './components/DropList'
import DropListItem from './components/DropListITem'
import { SEARCH_HISTORY, MAX_HSITORY, DROP_MODEL } from './constants'
import styles from './DropListLinkageInput.less'

let isHoverClearnBtn = false
let dropModel
let hasPropsError = false

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
    onChange: () => {},
    onInputChange: () => {},
    onInputSearch: () => {},
    onDropListItemClick: () => {},
    selectTree: null,
    selectTag: {},
    inputDropList: null,
  }

  constructor(props, ...args) {
    super(props, ...args)

    const { searchWords = '' } = props

    this.state = {
      searchWords,
      dropVisible: false,
    }
  }

  componentWillUpdate(nextProps, nextState) {
    const { inputDropList } = nextProps

    hasPropsError = false

    if (inputDropList && typeof inputDropList === 'object') {
      if (inputDropList.type === DropList) {
        const { children } = inputDropList.props

        if (Array.isArray(children)) {
          if (children.every(_ => _.type === DropListItem)) {
            const items = children.map(ele => {
              const {
                props: { onClick: click },
              } = ele
              const item = React.cloneElement(ele, {
                onClick(...args) {
                  console.log(args)
                  click instanceof Function && click(...args)
                },
              })

              return item
            })

            console.log(items)
          } else {
            hasPropsError = true
            this.logErr(
              `Invalid props "inputDropList -> children -> item", expected "DropListItem"`
            )
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

      dropModel = DROP_MODEL.keywords
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
    let nodes = null

    if (dropModel === DROP_MODEL.keywords) {
      nodes = inputDropList
    } else {
      const history = getHistory()

      nodes = history.length ? (
        <DropList>
          {history.map((_, idx) => (
            <DropListItem
              key={idx}
              onClick={ev =>
                this.handleItemClick({
                  ev,
                  idx,
                  type: DROP_MODEL.history,
                  record: _,
                })
              }
            >
              {_}
            </DropListItem>
          ))}
          <div className={styles.clearnWrap}>
            <span
              className={styles.clearnBtn}
              onClick={ev => {
                isHoverClearnBtn = false
                this.handleClearn(ev)
              }}
              onMouseEnter={() => {
                isHoverClearnBtn = true
              }}
              onMouseLeave={() => {
                isHoverClearnBtn = false
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

  handleInputChange = ev => {
    const { target } = ev
    const { value } = target
    const { onInputChange } = this.props

    onInputChange(ev, value)
    this.setState({ searchWords: value })
  }

  handleInputFocus = ev => {
    this.setState({ dropVisible: true })
  }

  handleInputBlur = ev => {
    if (!isHoverClearnBtn) {
      this.setState({ dropVisible: false })
    }
  }

  handleItemClick = ({ ev, idx, record, type }) => {
    const { onInputSearch, onDropListItemClick } = this.props

    onInputSearch(record)
    onDropListItemClick({ ev, idx, record, type })
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
