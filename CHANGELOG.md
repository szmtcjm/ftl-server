# ftl-server 1.0.0 (Dec 23, 2015)
* http默认端口改为80，https默认端口改为443
* 增加默认代理。`/a/p/`、`/a/f/`等等默认代理到`/`
* 错误提示现在更加清晰
* 修复执行git命令的时候触发livereload
* 增加配置字段`ftl.dataFiles`，可以指定单独的freemarker数据文件。具体看README.md的说明
* mock字段的数组值既可以是对象，又可以是文件路径，路径表示mock数据。具体看README.md的说明
* 完善单元测试
