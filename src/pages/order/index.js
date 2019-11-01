import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Row, Form, Input, Table } from 'antd'
import { Trans, withI18n } from '@lingui/react'
import config from 'utils/config'
import styles from './index.less'

@withI18n()
@connect(({ order }) => ({ order }))
class OrderIndex extends PureComponent {
  
  componentDidMount(){
    this.getList()
  }

  getList=()=>{
    const { dispatch } = this.props
    dispatch({
      type: 'order/queryOrderList',
      payload:{
        pageNum: 1,
        pageSize: 10
      }
    })
  }

  render() {
    
    return (
      // <Table />
      <p>dsgfsdgd</p>
    )
  }
}

export default OrderIndex
