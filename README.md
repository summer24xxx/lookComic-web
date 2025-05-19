# comic-view-web 前端项目说明

## 项目简介

本项目为漫画阅读平台的前端部分，基于 [Vue 2.x](https://cn.vuejs.org/) 框架开发，集成了 Element-UI、Bootstrap 等主流前端库，支持漫画浏览、用户交互等功能。

## 技术栈

- Vue 2.6.11
- Vuex 3.1.2
- Vue Router 3.1.6
- Element-UI 2.15.14
- Bootstrap 4.4.1
- Axios 0.19.2
- jQuery 3.4.1


## 环境准备

- Node.js 版本建议 >= 10.x
- npm (Node 包管理器，随 Node.js 一起安装)

## 安装依赖

在 `comic-view-web-master` 目录下执行：

```bash
npm install
```

## 本地开发启动

```bash
npm run serve
```

启动后，默认访问地址为 [http://localhost:8080](http://localhost:8080)。

## 项目打包

```bash
npm run build
```

打包后的文件会生成在 `dist/` 目录下。

## 目录结构

```
comic-view-web-master/
├── public/           # 公共静态资源
├── src/              # 源码目录
│   ├── api/          # 接口请求相关
│   ├── assets/       # 静态资源
│   ├── components/   # 公共组件
│   ├── router/       # 路由配置
│   ├── store/        # Vuex 状态管理
│   ├── style/        # 样式文件
│   ├── utils/        # 工具函数
│   ├── views/        # 页面视图
│   ├── App.vue       # 根组件
│   └── main.js       # 入口文件
├── package.json      # 项目依赖及脚本
└── vue.config.js     # Vue CLI 配置
```

## 其他说明

- 本项目使用了 Element-UI 和 Bootstrap，部分样式可根据实际需求自定义。
- 接口请求统一封装在 `src/api/` 目录下，便于维护和扩展。
- 如需对接后端，请确保后端服务已启动并配置好跨域等相关设置。
