# taro-page-plugin

> Taro 生成页面/组件插件

## 安装

在 Taro 项目根目录下安装

```bash
$ npm i taro-page-plugin --save
```

## 使用

### 引入插件

修改项目 `config/index.js` 中的 plugins 配置为如下

```js
const config = {
  ...
  plugins: [
    ...其余插件

    ['taro-page-plugin',{
       css:'scss',// 默认 scss
       version: 3// taro 版本默认 3
    }]
  ]
  ...
}
```



### 插件配置

> #### generator 插件支持以下参数

| 参数项     | 类型   | 是否可选 | 用途                                                   | 默认值 |
| :--------- | :----- | :------- | :----------------------------------------------------- | :----- |
| css        | string | 是       | 指定 css 类型，可选择 `none`,`sass`,`less`,   | `css` |
| version    | number | 是       | 指定 Taro 版本，可选 2、3,                    | `version`|
                                                       |

> 这样可通过 `taro template 参数` 来自动化创建页面

### 命令行参数

generator 插件支持以下参数

| 参数项      | 类型   | 是否可选 | 用途                    |
| :---------- | :----- | :------- | :---------------------- |
| --component | string | 是       | 创建一个组件/页面级组件 |
| --page      | string | 是       | 创建一个页面            |

#### 使用案例

##### 1.创建项目组件

```bash
 taro template --component Button
```

生成结果：

```
-- 组件:      components/Button/index.tsx
-- 组件样式:  components/Button/index.scss
```

##### 2.创建页面组件

```bash
 taro template --component index/Button  // index为页面文件夹名称，自动生成为 pages/index
```

生成结果：

```
-- 组件:      pages/index/components/Button/index.tsx
-- 组件样式:  pages/index/components/Button/index.less
```

##### 3.创建页面(简化版)

```bash
 taro template --page/subpackages Detail
```

生成结果：

```
-- 页面:          pages | subpackages /Detail/Detail.tsx
-- 页面配置:       pages | subpackages /Detail/Detail.config.tsx
-- 页面样式:      pages | subpackages /Detail/Detail.scss
```

##### 4.创建页面(指定具体页面名称)

```bash
 taro template --page/subpackages index/search
```

生成结果：

```
-- 页面:          pages | subpackages/index/search.tsx
-- 页面配置:       pages | subpackages/index/search.config.tsx
-- 页面样式:      pages | subpackages/index/search.less
```


```
