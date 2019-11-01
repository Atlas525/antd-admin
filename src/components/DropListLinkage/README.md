# 下拉联动组件

---

## useage
```tsx
import { DropListLinkage } from 'components'
import { Select } from 'antd'

const type ValueType = {
  SELECT_TAG: 'SELECT_TAG' // 多选 SELECT
  SELECT: 'SELECT'         // 下拉框
  DATE_1: 'DATE_1'         // 单选日期
  DATE_2: 'DATE_2'         // 复选日期
  INPUT: 'INPUT'           // 输入框
}

const type Item = {
  type: ValueType
  value: string | Array<Moment> // Moment antd 日期组件返回值
  origin: object // select-tree node
}

const options = [
  { name: 'Andy', age: 33 },
  { name: 'Kevin', age: 27 },
  { name: 'Alex', age: 24 },
].map((_, idx) => (
  <Select.Option key={idx} value={`${_.name}: ${_.age}`}>
    {_.name}
  </Select.Option>
))

const selectProps = {
  selectTree,
  onChange: (args: Array<Item>) => {...},
  selectTag: { options },
}

<DropListLinkage {...selectProps} />

```

## 参数
- selectTree `参考 select-tree.js 格式`
- onChange `回调函数`
- selectTag `多选标签属性，自定义 Select.Option`

## 文件说明
- dom-helper.js `dom 操作相关`
- DropListLinkage.jsx `组件文件`
- DropListLinkage.less `组件样式`
- select-tree-helper.js `树操作相关`
- select-tree.js `树配置`
