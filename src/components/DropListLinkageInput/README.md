# 下拉联动组件 + input + 下拉选择

**下拉框联动组件属性保持不变**

```jsx
  static defaultProps = {
    // 下拉框联动属性
    onChange: () => { },
    selectTree: null,
    selectTag: {},

    // input 属性
    onInputChange: () => { },
    onInputSearch: () => { },
    onDropListItemClick: () => { },

    // 下拉框属性
    inputDropList: null,
  }
```

## usege

```jsx
import { DropListLinkageInput } from 'components'

const { DropList, DropListItem } = DropListLinkageInput
const items = [
  '11111111111111',
  '22222222222222',
  '33333333333333',
  '44444444444444'
]
const inputDropList = (
  <DropList>
    {items.map((text, idx) => (
      <DropListItem
        key={idx}
        onClick={() => {
          console.log(text)
        }}
        keywords={text}
      >
        <Icon type="smile" theme="outlined" />
        <span style={{ marginLeft: 9 }}>{text}</span>
      </DropListItem>
    ))}
  </DropList>
)

render() {
  const selectProps = {
    // 下拉框联动属性
    selectTree,
    selectTag: { options },
    onChange: (...args) => {
      console.log(args)
    },

    // 下拉框属性
    inputDropList,
  }

  return (
    <DropListLinkageInput {...selectProps}  />
  )
}
```
<div style="color:#ff6f6c">
当 DropList 的 children 如果不是 string 类型时候 (如标签)
<br />
那么需要传递 keywords 属性 (为 input 赋值用)
</div>
