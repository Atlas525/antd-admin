## 独立的下拉列表

`当包裹元素时，列表默认插入 body 中`

#### usage

- 配合 input 使用
```jsx harmony
  // 已有组件 InputDrop
  // 会开启键盘上下键
  <DropList {...dropListProps}>
    <Input {...inputProps}/>
  </DropList>
```

- 单独使用
```jsx harmony
  // 当 drop list 中 item 为 ReactNode 时，
  // 考虑到需要放大元素优化事件触发区域会去掉默认的 padding: 10px 16px,
  const dropData = [
    'item one',
    'item tow',
    'item three',
    'item four',
  ]
  const dropList = dropData.map((item, idx) => (
    <div key={idx} onClick={ev => { this.clickItem(ev, idx)}}>
      {item}
    </div>
  ))
  const dropListProps = {
    dropList
  }
  <DropList {...dropListProps} />
```

#### props
```javascript
  header: null,
  visible: false,
  dropList: [],
  trigger: 'hover' || 'click', // 弹出触发方式
  keywords: undefined, // 默认值，匹配高亮 item
```

#### events
```javascript
  onChange: () => {},
  onOpen: () => {},
  onClose: () => {},
  onItemHover: () => {},
  onItemClick: () => {},
```

