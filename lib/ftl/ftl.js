var TemplateRun = require('./TemplateRun');
var config = require('../config');
var assign = require('object-assign');

//ftl目录为配置的base字段，如果未配置则为当前工作目录
var base = config.base || process.cwd();
var ftlConfig = config.ftl;
var globalDataModel = ftlConfig.global || {};

exports.render = function render(path, args, callback) {
    var settings = {
        encoding: 'utf-8',
        viewFolder: base
    };
    var index = path.lastIndexOf('\/') === -1 ? 
        path.lastIndexOf('\\') : path.lastIndexOf('\/');
    var fileName = path.substring(index + 1);
    var dataModel;
    if (typeof ftlConfig[fileName] === 'function') {
        dataModel = ftlConfig[fileName](args.req, args.res);
    } else {
        dataModel = ftlConfig[fileName];
    }
    dataModel = assign(globalDataModel, dataModel);
    path = path.replace(base, '');
    TemplateRun.processTemplate(path, dataModel, settings, callback);
}