# 快房传媒后台管理系统（无权限版）

> `master` 分支为带权限版本

## 本地调试

更改 `config/index.js` 中 `proxyTable` 的地址为测试API的地址即可。

## 左侧菜单设置

设置 `src/plugins/store/state/index.js` 的 `nav` 字段。

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
