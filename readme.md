# ftl-server

[![npm](https://img.shields.io/npm/v/ftl-server.svg)](https://www.npmjs.com/package/ftl-server)
[![Build Status](https://travis-ci.org/szmtcjm/ftl-server.svg?branch=master)](https://travis-ci.org/szmtcjm/ftl-server)

ftl-server 是一前端开发工具，支持解析freemarker模板，模拟后端接口，反向代理等功能。

## 特性

* 解析freemarker模板
* 静态资源服务
* mock请求
* 代理请求
* livereload
* weinre
* 自定义路由配置

## 安装

```bash
npm install ftl-server -g
```
## 使用

```bash
ftl-server -c ./config.js -p 8080
```
或者

```bash
fs -c ./config.js -p 8080
```

ftl-server命令的选项不多，可以通过`ftl-server help`查看帮助

* `-c, --config` 指定配置文件。但不是必需的, 如果没有指定，则寻找当前工作目录下的`ftl.config.js`作为配置文件
* `-p, --port` 服务的端口，默认80
* `-l, --log` 配置打印日志，指定要显示的日志，可以指定多个。比如`-l mock proxy error`表示只显示mock，proxy和error日志。默认为`-l all`，表示显示所有日志
* `--hot` 开启livereload；开启后修改css会自动更新页面的样式，修改ftl/js/图片等会自动刷新页面
* `--https` 启动https服务，默认是http服务。开启https后的默认端口为443
* `-h, --help` 帮助
* `-v, --version` 显示版本号

## 配置文件

配置文件是一个JSON或者export一个对象的module，配置文件配置所有功能。修改配置文件服务自动重启，下面是一个例子

```js
module.exports = {
  public: 'E:\\somedir\\public',
  port: '80',
  hot: true,
  watch: [require.resolve('./page.ftl'), 'E:\\ftlServer\page.mock'],
  remoteDebug: {
    browser: 'firefox'
  },
  urlMap:false, //默认不开启
  ftl: {
    urlMaps: { 
        '/': '/index'  //需要开启urlMap生效,例如: 对应访问index.ftl
    },
    base: 'E:\\somedir\\ftl',
    dataFiles: ['E:\\somedir\\data.ftl'],
    global: {

    },
    'ftlfile.ftl': function(req, res) {
      return {
        saleActivityMap: {
          "000008": {
            activityStatus: 'actived'
          }
        }
      }
    }

  },
  mock: [{
    path: '/request',
    method: 'get',
    status: '200',
    header: {

    },
    response: function(req, res) {
      return {
        a: 1,
        B: 2
      }
    }
  }, 'E:\\mock\\mock.js'],
  proxy: [{
    path: '/proxy1',
    target: 'http://localhost:3000'
    }
  ]
}
```

### 全局配置字段

* `public` 静态文件目录，可以是一字符串，或者数组以指定多个静态目录
* `port` 本地服务端口
* `hot` 开启livereload，值为boolean
* `urlMap` 是否开启urlMap，值为boolean，默认不开启
* `watch` 需要监控的额外的配置文件，值为数组。比如watch: ['./page.ftl', './page.mock']，可以是绝对路径或相对路劲，相对路径相对于主配置文件(比如:ftl.config.js)
* `https` 启动https服务，值为boolean, 开启后默认端口为443
* `remoteDebug`  针对weinre的配置。该值若为true，表示开启weinre，并使用默认配置；或者为object，
key支持[weinre的所有配置字段](http://people.apache.org/~pmuellr/weinre-docs/latest/Running.html)。
还有一个key: `browser`，表示打开weinre client的浏览器，默认是chrome。还有目前weinre(20150911)是不支持https的，但是ftl-server使用proxy来支持https。

### ftl

`ftl` 字段用来配置freemarker的解析，服务起来后访问根目录会列出base目录下的文件列表。
* `urlMaps` 配置自定义路由,值为对象
* `base` 配置freemarker模板目录
* `global` freemarker共享的数据模型，即所有模板都会用到
* `dataFiles` 值为数组。表示引入单独的ftl数据模型文件，文件实例如下：
```js
//E:\\dir\\data.ftl.js, 单独的ftl数据模型文件
//key:ftlFile.ftl表示要渲染的ftl文件， value表示该渲染该ftl的数据
module.exports = {
  'ftlFile.ftl': {
      data: ''
  }
}
```

其他就是特定模板的数据模型，字段的key是模板文件名（不包含目录路径），value可以是对象；也可以是函数且返回一对象（函数的参数是express中间件req，res）



> 注意事项： freemarker用`<#assign>`定义的数据模型会屏蔽程序传入的数据模型，所以在dataModel.html中定义的数据模型会屏蔽这里定义的数据模型。  

### mock

`mock` 字段配置接口模拟，值是一数组，数组中的每个值是一个对象或者一个路径，对象表示模拟一个请求。

* `path` 请求的path, 本来应该是严格的路由path(不包含querystring), 如果提供除path外的url的其他部分则会忽略。原来这个字段叫`url`,已废弃
* `method` 请求的方法，get/post等等,默认get
* `status` 请求的响应状态，默认200
* `delay` 请求响应的延迟
* `contentType` Content-Type响应头，默认application/json
* `header` 其他响应头的配置
* `jsonp` 该模拟是个jsonp。这个字段跟jQuery的jQuery.ajax([settings])中的设置字段jsonp是一个意思，默认的回调函数名字是`callback`，
即加在请求url后面的`callback=?`。如果该字段值设为true，则用默认的`callback`；如果设为一个具体的值（string类型），比如`jsonpCallback`，
则加在请求url后面的变为`jsonpCallback=?`
* `response` 响应内容。可以是字符串，对象，函数，其中函数的入参是req、res（express的中间件的入参），函数中可以自己响应结束请求，或者返回一个响应对象。

如果值是路径，则路径的文件为一export出mock数据，实例文件如下
```js
// /dir/mock.js
// 可以export一数组，或者直接一对象
module.exports = [{
  path: '/mock',
  method: 'post',
  response: function(req, res) {
      return {
          result: true
      }
  }
}]
```

### proxy

`proxy` 字段配置反向代理，也是一数组，数组每个对象表示一个反向代理的配置。该配置有一个规则：即，**实际访问的路径除去配置中的path后的路径，会添加到target后面，成为代理请求的路径。** 这样说可能不清楚，举个例子：

```js
{
  path: '/proxy',
  target: 'http://localhost:3000'
}
```
以上是其中一个配置，则：
1. 只要匹配以`/proxy`开头, 都会反向代理请求，比如`/proxy`, `/proxy/`, `/proxy/w/r?p=1`等等
2. 当访问`/proxy/w?a=1`的时候，代理请求的地址是`http://localhost:3000/w?a=1`。  


下面是可配置字段的说明
* `path` 表示需要反向代理的请求path
* `target` 表示代理的目标地址
* `host` 自定义请求`target`时请求头中的host字段，默认是`target`代表的host

## [CHANGELOG](https://github.com/xmllein/ftl-server/blob/master/CHANGELOG.md)
## License

MIT
