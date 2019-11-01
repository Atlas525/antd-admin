import React from 'react'
import classNames from 'classnames'
import styles from './DropListItem.less'

export default function DropListItem(props) {
  const { className, children, ...omitted } = props

  return (
    <div className={classNames(styles._dropListItem, className)} {...omitted}>
      {children}
    </div>
  )
}
