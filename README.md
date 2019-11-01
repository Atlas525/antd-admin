<div align="center">
  <img alt="antd-admin" height="64" src="./docs/icon-1024.png">
  <h1 align="center">CJ 祖传代码[前端]</h1>
</div>

## 架构
`umi ^2.8.9` `dva 2.4.1` `antd ^3.19.0` `axios ^0.19.0`

- 使用文档 - [https://doc.antd-admin.zuiidea.com/#/zh-cn/](https://doc.antd-admin.zuiidea.com/#/zh-cn/)


## 新建模块命令
- 创建新的模块在项目主目录下输入:

```shell
npm run page [--<parent page>]
```
- 按照要求输入名称即可

## 编码指南
[JavaScript Style Guide](./docs/JavaScriptStyleGuide.md)

## import xxx from xxx 路径别名

|别明         |路径
|-------------|--------------------|
|@            | src                |
|api          | src/services/      |
|components   | src/components     |
|config       | src/utils/config   |
|models       | src/models         |
|routes       | src/routes         |
|services     | src/services       |
|themes       | src/themes         |
|utils        | src/utils          |
|assets       | assets             |


## 使用

1. 安装依赖

```bash
npm install
```

2. 启动本地服务器。

```bash
npm start
```

3. 启动完成后打开浏览器访问 [http://localhost:8000](http://localhost:8000)，如果需要更改启动端口，可在 `.env` 文件中配置。


## 支持环境

现代浏览器。

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Opera |
| --------- | --------- | --------- | --------- | --------- | 
|IE11, Edge| last 2 versions| last 2 versions| last 2 versions| last 2 versions
