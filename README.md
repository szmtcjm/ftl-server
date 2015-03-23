# ftl-server

[![Build Status](https://travis-ci.org/szmtcjm/ftl-server.svg?branch=dev)](https://travis-ci.org/szmtcjm/ftl-server)

ftl-server 是一前端开发工具，支持解析freemarker模板，模拟后端接口，反向代理等功能。 

## 安装

```bash
npm install ftl-server -g
```
## 使用

```bash
ftl-server -c ./config.js -p 8080
```

ftl-server命令的选项不多，其中配置文件必须 `-c ./config.js`, -p 服务的端口，默认8000, 可以通过`ftl-server help`查看帮助

## 配置文件

配置文件是一个JSON或者export一个对象的module，配置文件配置所有功能。修改配置文件服务自动重启，下面是一个例子

```js
module.exports = {
  'public': 'E:\\20150228-origin-2\\20150228-origin-2\\apache',
  port: '80',
  ftl: {
    base: 'E:\\20150228-origin-2\\20150228-origin-2\\fund-web\\src\\main\\webapp\\WEB-INF\\ftl',
    global: {

    },
    'productDetail_000008_new.ftl': function(req, res) {
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
    url: '/request',
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
  }],
  proxy: {
    '/get': ''
  }
}
```

### 全局配置字段

* `public` 静态文件目录
* `port` 本地服务端口

### ftl

`ftl`字段用来配置freemarker的解析，服务起来后访问根目录会列出base目录下的文件列表。

* `base`配置freemarker模板目录
*  `global`freemarker共享的数据模型，即所有模板都会用到
* 其他就是特定模板的数据模型，字段的key是模板文件名（不包含目录路径），value可以是对象；也可以是函数且返回一对象（函数的参数是express框架的请求响应对象req，res）



> 注意事项： freemarker用`<#assign>`定义的数据模型会屏蔽程序传入的数据模型，所以在dataModel.html中定义的数据模型会屏蔽这里定义的数据模型。  

### mock

`mock`字段配置接口模拟，值是一数组，数组中的每个对象表示模拟一个请求。

* `url` 请求的path
* `method` 请求的方法，get/post等等,默认get
* `status` 请求的响应状态，默认200
* `delay` 请求响应的延迟
* `contentType` Content-Type响应头，默认application/json
* `header` 其他响应头的配置
* `jsonp` 该模拟是个jsonp。这个字段跟jQuery的jQuery.ajax([settings])中的设置字段jsonp是一个意思，默认的回调函数名字是`callback`，
即加在请求url后面的`callback=?`。如果该字段值设为true，则用默认的`callback`；如果设为一个具体的值（string类型），比如`jsonpCallback`，
则加在请求url后面的变为`jsonpCallback=?`
* `response` 响应内容。可以是字符串，对象，函数，其中函数的入参是req、res（express的中间件的入参），函数中可以自己响应结束请求，或者返回一个响应对象。

### proxy

反向代理的配置，待实现...
