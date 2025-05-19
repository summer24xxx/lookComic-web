# 漫画阅读系统前台

## 项目简介

这是一个基于前后端分离架构的漫画阅读系统，采用现代化的技术栈实现，为用户提供流畅的漫画阅读体验。

## 技术栈

### 前端技术栈

- **核心框架**：Vue.js 2.6.11
- **构建工具**：Vue CLI 4.2.0
- **状态管理**：Vuex 3.1.2
- **路由管理**：Vue Router 3.1.6
- **UI 框架**：
  - Element UI 2.15.14
  - Bootstrap 4.4.1
- **HTTP 客户端**：Axios 0.19.2
- **工具库**：
  - Lodash 4.17.15（工具函数库）
  - jQuery 3.4.1（DOM 操作）
  - QS（URL 参数处理）
  - NProgress 0.2.0（页面加载进度条）
  - Mouse Firework 0.0.6（鼠标特效）
- **开发工具**：
  - Babel（ES6+转译）
  - ESLint（代码规范检查）
  - Webpack（模块打包）

### 后端技术栈

- **核心框架**：Spring Boot 2.2.4.RELEASE
- **安全框架**：Spring Security
- **ORM 框架**：MyBatis 1.3.2
- **数据库**：MySQL 8.0.19
- **分页插件**：PageHelper 5.1.8
- **API 文档**：Swagger 2.9.2
- **模板引擎**：Thymeleaf
- **开发工具**：
  - Spring Boot DevTools（热部署）
  - Spring Boot Configuration Processor（配置处理）

## 项目特点

1. 采用前后端分离架构，提高开发效率和系统可维护性
2. 使用 Vue.js 框架，实现响应式数据绑定和组件化开发
3. 集成 Element UI 和 Bootstrap，提供美观的用户界面
4. 使用 Spring Boot 快速构建后端服务
5. 采用 MyBatis 实现数据持久化
6. 集成 Swagger 实现 API 文档自动生成
7. 使用 Spring Security 实现系统安全控制

## 开发环境要求

- Node.js 12+
- JDK 1.8+
- MySQL 8.0+
- Maven 3.6+

## 项目启动

### 前端启动

```bash
cd comic-view-web-master
npm install
npm run serve
```

### 后端启动

```bash
cd comic-view-master
mvn spring-boot:run
```

## 项目结构

```
comic-view-master/          # 后端项目
├── src/                    # 源代码
│   ├── main/
│   │   ├── java/          # Java源代码
│   │   └── resources/     # 配置文件
│   └── test/              # 测试代码
└── pom.xml                # Maven配置文件

comic-view-web-master/     # 前端项目
├── src/                   # 源代码
│   ├── assets/           # 静态资源
│   ├── components/       # Vue组件
│   ├── router/          # 路由配置
│   ├── store/           # Vuex状态管理
│   └── views/           # 页面视图
└── package.json         # 项目依赖配置
```
