import { cloneDeep } from 'lodash'

export const ID = '_position-id'

export default {
  addLinkageId({ tree, colIndex = 0, rowIndex = 0, track }) {
    let { children } = tree
    const hasChildren = Array.isArray(children)
    const _track = track !== undefined ? track : rowIndex.toString()

    if (hasChildren) {
      children = children.map((_tree, idx) => {
        return this.addLinkageId({
          tree: _tree,
          colIndex: colIndex + 1,
          rowIndex: idx,
          track: `${_track}-${idx}`,
        })
      })
    }

    tree[ID] = _track

    return { ...tree, children }
  },
  getVisibleSelect(tree) {
    const selectItems = []
    const tree2array = (_tree, level = 0, idx = 0) => {
      const { children, visible } = _tree
      const hasChildren = Array.isArray(children)

      if (visible && Array.isArray(_tree.children)) {
        selectItems.push(_tree) // 横向 select node
      }
      if (hasChildren) {
        children.forEach((_, i) => tree2array(_, level + 1, i))
      }
    }

    // 横向组装，不要用递归
    tree2array(tree)

    return selectItems
  },
  getAncestors(tree) {
    return function(node) {
      // node 树节点
      let trackIndexes = [] // 命中 json 索引链
      let trackItems = [] // 命中 json 链
      const getAncestorsIndex = (_tree, track = [], items = [tree]) => {
        const { children } = _tree
        const hasChildren = Array.isArray(children)

        if (hasChildren) {
          // const tmp = children.find(_ => _.name === node.name) // 如果两个节点 name 相同会有 BUG 的哦 ^_^
          const tmp = children.find(_ => _[ID] === node[ID]) // 19-09-09 fixed

          if (tmp) {
            trackIndexes = track
            trackItems = items
          } else {
            children.forEach((_t, _idx) => {
              getAncestorsIndex(_t, track.concat(_idx), items.concat(_t))
            })
          }
        }
      }

      getAncestorsIndex(tree)

      return [trackIndexes, cloneDeep(trackItems)]
    }
  },
  isAncestorOfNode(node, ancestor = {}) {
    let res = null

    this.foreach(ancestor)(_ => {
      if (!res) {
        if (_[ID] === node[ID]) {
          res = ancestor
        }
      }

      return _
    })

    return res
  },
  switchSelectTreeVisible(tree) {
    return function({ linkageItems, colItem, rowItem }) {
      const visibleTree = (_tree, level = 0) => {
        let { children } = _tree
        const hasChildren = Array.isArray(children)

        if (hasChildren) {
          children = children.map((_, idx) => {
            const ancestor = linkageItems[level]
            let visible = false

            // 19-09-04
            if (ancestor && ancestor[ID].length <= colItem[ID].length) {
              // ancestor or self column [鼠标悬浮列及祖先列]
              const { visible: bool } = _
              visible = bool
            } else if (rowItem[ID] === _[ID]) {
              // final level column [鼠标悬浮列]
              visible = true
            }

            return {
              ...visibleTree(_, level + 1),
              visible,
              // 19-09-03 记一次 BUG, 只是比较了焦点坐标，比如 [5, 5] 和 [0, 5] 这么比就会相等，因为只比较了最后一项，忽略了前面
              // 19-09-04 tree 的节点会有重复坐标
              // visible: linkageIndexes[level] === idx
            }
          })
        }

        return { ..._tree, children }
      }

      return visibleTree(tree)
    }
  },
  /** 递归遍历 */
  foreach(tree) {
    return function(cb) {
      /**
       *
       * @param _tree 遍历对象，selectTree
       * @param colIndex 横向 index
       * @param rowIndex 纵向 index
       * @returns {*} selectTree
       * @private
       */
      const _foreach = (_tree, colIndex = 0, rowIndex = 0) => {
        const { children } = _tree
        const hasChildren = Array.isArray(children)

        if (hasChildren) {
          _tree.children = children.map((_item, _idx) => {
            return _foreach(_item, colIndex + 1, _idx)
          })
        }

        return cb(_tree, colIndex, rowIndex)
      }

      return _foreach(tree)
    }
  },
}
