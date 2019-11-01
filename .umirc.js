// https://umijs.org/config/
import { resolve } from 'path'
import { i18n, disableFrontMenus, isDev, apiPrefix } from './src/utils/config'

const umiConfig = {
  history: 'hash',
  ignoreMomentLocale: true,
  targets: { ie: 9 },
  treeShaking: true,
  plugins: [
    [
      // https://umijs.org/plugin/umi-plugin-react.html
      'umi-plugin-react',
      {
        dva: { immer: true },
        antd: true,
        dynamicImport: {
          webpackChunkName: true,
          loadingComponent: './components/Loader/Loader',
        },
        routes: {
          exclude: [
            /model\.(j|t)sx?$/,
            /service\.(j|t)sx?$/,
            /utils\.(j|t)sx?$/,
            /models\//,
            /components\//,
            /services\//,
            /utils\//,
          ],
          update: routes => {
            if (!i18n) return routes

            const newRoutes = []
            for (const item of routes[0].routes) {
              newRoutes.push(item)
              if (item.path) {
                newRoutes.push(
                  Object.assign({}, item, {
                    path:
                      `/:lang(${i18n.languages
                        .map(item => item.key)
                        .join('|')})` + item.path,
                  })
                )
              }
            }
            routes[0].routes = newRoutes

            return routes
          },
        },
        dll: {
          include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch', 'antd/es'],
        },
        pwa: {
          manifestOptions: {
            srcPath: 'manifest.json'
          },
        }
      },
    ],
  ],
  // Theme for antd
  // https://ant.design/docs/react/customize-theme
  theme: './config/theme.config.js',
  // Webpack Configuration
  proxy: {
    // [apiPrefix]: {
    //   target: 'http://api.seniverse.com/',
    //   changeOrigin: true,
    //   pathRewrite: { [apiPrefix]: '' },
    // },
    '/order': {
      target: 'http://192.168.5.49:8081/',
      changeOrigin: true,
      pathRewrite: { '/order': '' },
    },
  },
  alias: {
    "@": resolve(__dirname, './src'),
    api: resolve(__dirname, './src/services/'),
    components: resolve(__dirname, './src/components'),
    config: resolve(__dirname, './src/utils/config'),
    models: resolve(__dirname, './src/models'),
    routes: resolve(__dirname, './src/routes'),
    services: resolve(__dirname, './src/services'),
    themes: resolve(__dirname, './src/themes'),
    utils: resolve(__dirname, './src/utils'),
    root: resolve(__dirname),
    assets: resolve(__dirname, './assets'),
  },
  extraBabelPresets: ['@lingui/babel-preset-react'],
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: 'lodash',
        libraryDirectory: '',
        camel2DashComponentName: false,
      },
      'lodash',
    ],
  ],
}

if (isDev) {
  const menusHelper = [
    //# 自定义 umi-plugin ^_^
    './scripts/umi-plugin-caoxie.js',
    {
      disableFrontMenus,
      exclude: ['.umi', 'login']
    }
  ]

  umiConfig.plugins.push(menusHelper)
}

export default umiConfig
