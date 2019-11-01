import React from 'react'
import { Input as AntdInput } from 'antd'
import styles from './Input.less'

class Input extends React.PureComponent {
  get inputProps() {
    const { ...props } = this.props

    return {
      ...props,
    }
  }

  render() {
    return <AntdInput className={styles.Input} {...this.inputProps} />
  }
}

export default Input
