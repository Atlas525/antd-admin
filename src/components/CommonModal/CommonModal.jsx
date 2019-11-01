import React from 'react'
import { Modal } from 'antd'
import './CommonModal.less'

const CommonModal = ({ ...modalProps }) => {
  const commonProps = {
    visible: true,
    // width: 'calc(100% - 300px)',
    // wrapClassName: 'modal-container',
    // centered: true,
    maskClosable: false,
    destroyOnClose: true,
  }

  return <Modal {...commonProps} {...modalProps} />
}

export default CommonModal
