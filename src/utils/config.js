const isDev = process.env.NODE_ENV === 'development'

module.exports = {
  siteName: 'Cj Admin',
  // copyright: '',
  logoPath: '/icon-40.png',
  apiPrefix: '/api/v1',
  fixedHeader: true, // sticky primary layout header

  /* Layout configuration, specify which layout to use for route. */
  layouts: [
    {
      name: 'primary',
      include: [/.*/],
      exclude: [/(\/(en|zh))*\/login/],
    },
  ],

  /* I18n configuration, `languages` and `defaultLanguage` are required currently. */
  i18n: {
    /* Countrys flags: https://www.flaticon.com/packs/countrys-flags */
    languages: [
      {
        key: 'zh',
        title: '中文',
        flag: '/china.svg',
      },
      {
        key: 'en',
        title: 'English',
        flag: '/america.svg',
      },
      /* {
        key: 'pt-br',
        title: 'Português',
        flag: '/portugal.svg',
      }, */
    ],
    defaultLanguage: 'zh',
  },

  isDev,
  menusServerPort: 4000,
  disableFrontMenus: false, // 禁用前端生成菜单
  /* eslint-disable */
  URL: (function closure(url) {
    let _url
    if (isDev) {
    } else {
    }
    return _url
  })(),
  homePage: 'user', // 登录成功后跳转的首页
  iconfont: '//at.alicdn.com/t/font_1336406_ufayf4ul8o.js',
  signatureURL: 'https://app.cjdropshipping.com/app/oss/policy', // 阿里云OSS获取token地址
}
