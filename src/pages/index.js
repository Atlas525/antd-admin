import React, { PureComponent } from 'react'
import Redirect from 'umi/redirect'
import { withI18n } from '@lingui/react'
import { homePage } from 'utils/config'

@withI18n()
class Index extends PureComponent {
  render() {
    const { i18n } = this.props
    return <Redirect to={i18n.t`/${homePage}`} />
  }
}

export default Index
