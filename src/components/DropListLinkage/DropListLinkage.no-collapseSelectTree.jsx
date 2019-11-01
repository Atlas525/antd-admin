import React from 'react'
import classNames from 'classnames'
import { Icon, DatePicker, Input, Select } from 'antd'
import { cloneDeep } from 'lodash'
import { selectTree, nodeType } from './select-tree'
import domHelper from './dom-helper'
import treeHelper, { ID } from './select-tree-helper'
import styles from './DropListLinkage.less'

let oSelect
let oBtnGroup
let oBtnItem
let $selectTree = null
const selectProps = {
  mode: 'multiple',
  placeholder: 'Place Select',
}

class DropListLinkage extends React.PureComponent {
  static defaultProps = {
    onChange: () => {},
    selectTree: null,
    selectTag: {},
  }

  constructor(props, ...args) {
    super(props, ...args)

    const { selectTree: tree } = props

    $selectTree = treeHelper.addLinkageId({ tree: tree || selectTree })

    this.state = {
      select: cloneDeep($selectTree),
      visible: false,
      linkageCondition: [],
      valueCollector: new Map(),
    }

    this.selectItems = [] // 横向 select node

    this.linkageIndexes = [] // select node 关联索引

    // 关联条件: 与 state.linkageCondition 向前错开一位
    // conditions 每一项是 linkageCondition 每一项的父级
    this.conditions = []

    this.once = createOnce()
  }

  // eslint-disable-next-line
  get conditionGroup() {
    let { linkageCondition } = this.state
    let showDelete

    if (!linkageCondition.length) {
      // eslint-disable-next-line
      this.conditions = linkageCondition = [cloneDeep($selectTree)]
      showDelete = false
    } else {
      showDelete = true
    }

    return linkageCondition.map((item, idx, arr) => {
      let node = null
      const { type } = item
      const { valueCollector } = this.state
      const json = valueCollector.get(idx) || {}

      if (type === nodeType.INPUT) {
        if (!(json.origin && json.origin.type === type)) {
          valueCollector.set(idx, { type, value: '', origin: item }) // initialize
        }
        node = (
          <Input
            value={valueCollector.get(idx).value}
            className={styles.conditionMinWidth}
            onChange={ev => {
              this.setValueCollector(idx, {
                type,
                value: ev.target.value,
                origin: item,
              })
              this.onPropsChange()
            }}
          />
        )
      } else if (type === nodeType.DATE_2) {
        if (!(json.origin && json.origin.type === type)) {
          valueCollector.set(idx, { type, value: [], origin: item })
        }
        node = (
          <DatePicker.RangePicker
            className={styles.conditionDate2}
            value={valueCollector.get(idx).value[0]}
            onChange={(...args) => {
              this.setValueCollector(idx, { type, value: args, origin: item })
              this.onPropsChange()
            }}
          />
        )
      } else if (type === nodeType.SELECT_TAG) {
        if (!(json.origin && json.origin.type === type)) {
          valueCollector.set(idx, { type, value: [], origin: item })
        }
        const { selectTag } = this.props
        const _selectProps = {
          ...selectProps,
          ...selectTag,
          className: styles.conditionMinWidth,
          onChange: (...args) => {
            this.setValueCollector(idx, { type, value: args, origin: item })
            this.onPropsChange()
          },
        }
        const { options = null } = selectTag
        node = <Select {..._selectProps}>{options}</Select>
      } else {
        valueCollector.set(idx, {
          type: item.type || nodeType.SELECT,
          value: item,
          origin: item,
        })
        node = (
          <span
            className={styles.selectBtn}
            onClick={ev => this.handleBtnClick(ev, this.conditions[idx], idx)}
          >
            {item.name}
            <Icon type="caret-down" className={styles.btnIcon} />
          </span>
        )
      }

      return (
        <div key={`item-${idx}`} className={styles.btnItem}>
          {node}
          {showDelete && idx === arr.length - 1 && (
            <span
              className={classNames(styles.btnDelete, {
                [styles.marginLeft16px]:
                  type === nodeType.INPUT ||
                  type === nodeType.DATE_2 ||
                  type === nodeType.SELECT_TAG,
              })}
              onClick={() => {
                // reset linkage condition
                this.setState(
                  () => ({ linkageCondition: [] }),
                  () => {
                    this.onPropsChange([])
                  }
                )
              }}
            >
              <Icon type="delete" />
            </span>
          )}
        </div>
      )
    })
  }

  get selectNodes() {
    const { select } = this.state
    this.selectItems = treeHelper.getVisibleSelect(select)

    return this.selectItems.map((colItem, colIdx) => {
      const selectItem = colItem.children.map((rowItem, rowIdx) => {
        const isFinalLevel = colIdx < this.selectItems.length - 1 // 最后一级不需要高亮
        const activated = this.linkageIndexes[colIdx] === rowIdx && isFinalLevel

        return (
          <div
            className={classNames(styles.listItem, {
              [styles.listItemActive]: activated,
              [styles.displayNone]: !colItem.visible,
            })}
            key={`${colIdx}-${rowIdx}`}
            onMouseEnter={() =>
              this.selectItemHover({ colItem, colIdx, rowItem, rowIdx })
            }
            onClick={() => {
              this.selectItemClick({ colItem, colIdx, rowItem, rowIdx })
            }}
          >
            {rowItem.name}
          </div>
        )
      })

      return (
        <div
          className={classNames(styles.selectItem, {
            [styles.marginRight8px]: colIdx < this.selectItems.length - 1,
          })}
          key={`select-box-${colIdx}`}
        >
          {selectItem && colItem.header ? (
            <div className={classNames(styles.listHeader)}>
              {colItem.header}
            </div>
          ) : null}
          {selectItem}
        </div>
      )
    })
  }

  setValueCollector(idx, value) {
    const { valueCollector } = this.state

    // this.setState({ valueCollector: valueCollector.set(idx, value) })
    valueCollector.set(idx, value)
    this.forceUpdate()
  }

  onPropsChange(value) {
    const { onChange } = this.props

    if (value !== undefined) {
      onChange(value)
      return
    }

    const { linkageCondition, valueCollector } = this.state
    const values = linkageCondition
      .map((_, idx) => {
        return valueCollector.get(idx)
      })
      .filter(_ => _.type !== nodeType.PLACEHOLDER)

    onChange(values)
  }

  handleBtnClick = (ev, item, idx) => {
    // eslint-disable-next-line
    const select = treeHelper.foreach(this.state.select)(
      (_item, colIdx, rowIdx) => {
        let visible = false

        if (_item[ID] === item[ID]) visible = !_item.visible

        return { ..._item, visible }
      }
    )

    oBtnItem = ev.target
    oBtnItem.index = idx
    this.setState(() => ({ select }))
  }

  selectItemHover = ({ colItem, colIdx, rowItem, rowIdx }) => {
    const [, linkageItems] = treeHelper.getAncestors(cloneDeep($selectTree))(
      rowItem
    )

    // 使用 this.state.select [点击已经打开了一级菜单]
    // 不用 cloneDeep($selectTree) [一级菜单木有打开]
    // eslint-disable-next-line
    const select = treeHelper.switchSelectTreeVisible(this.state.select)({
      linkageItems: [...linkageItems.slice(1), rowItem], // 切掉树根
      colItem,
      rowItem,
    })

    this.setState(() => ({ select }))
  }

  selectItemClick = ({ colItem, colIdx, rowIdx, rowItem }) => {
    const isFinalLevel = this.selectItems.length - 1 === colIdx
    const [, items] = treeHelper.getAncestors($selectTree)(rowItem)

    if (isFinalLevel) {
      this.conditions = items

      const part = items.slice(1).map(_ => {
        _.origin = _
        return _
      })
      let linkageCondition = [...part, rowItem] // select

      if (rowItem.type === nodeType.INPUT) {
        linkageCondition = [
          ...part,
          { ...rowItem, type: nodeType.PLACEHOLDER },
          rowItem,
        ]
      }
      if (rowItem.type === nodeType.DATE_2) {
        linkageCondition = [
          ...part,
          { ...rowItem, type: nodeType.PLACEHOLDER },
          rowItem,
        ]
      }
      if (rowItem.type === nodeType.SELECT_TAG) {
        linkageCondition = [
          ...part,
          { ...rowItem, type: nodeType.PLACEHOLDER },
          rowItem,
        ]
      }
      this.setState(
        () => ({
          linkageCondition,
          select: cloneDeep($selectTree),
        }),
        () => {
          this.onPropsChange()
        }
      )
    }
  }

  calcSelectStyle = () => {
    let style

    if (oBtnGroup && oBtnItem) {
      const left =
        oBtnItem.getBoundingClientRect().left -
        oBtnGroup.getBoundingClientRect().left -
        (oBtnItem.index === 0 ? 16 : 0)
      // - parseFloat(window.getComputedStyle(oBtnGroup, null).paddingLeft) // 取不到值

      style = { left }
    }

    return style
  }

  render() {
    const { visible } = this.state
    /*
    this.once(() => {
      this.dropBoxCls = { [styles.displayNone]: !visible }
    }) // 第一次渲染
    domHelper.handleAnimate(oSelect, visible) // dom 动画
    */

    return (
      <div>
        <div className={styles.dropWrap}>
          <div
            ref={o => {
              oBtnGroup = o
            }}
            className={styles.searchWrap}
          >
            <div className={styles.btnGroup}>{this.conditionGroup}</div>
          </div>
          <div
            data-tag="animate-tag"
            ref={o => {
              oSelect = o
            }}
            style={this.calcSelectStyle()}
            className={classNames(styles.dropBox, this.dropBoxCls)}
          >
            {this.selectNodes}
          </div>
        </div>
      </div>
    )
  }
}

export default DropListLinkage

function createOnce() {
  let bool = false

  return function(cb) {
    if (!bool) {
      bool = true
      cb()
    }
  }
}
