import React from 'react'
import classNames from 'classnames'
import styles from './DropList.less'

export default function DropList(props) {
  const { className, children, ...omitted } = props

  return (
    <div className={classNames(styles._dropList)} {...omitted}>
      {children}
    </div>
  )
}
