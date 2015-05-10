var URL = require('node-url-util');
var qs = require('querystring');
var _ = require('lodash');
/*
 * Generate method + full uri + body for request seen test.
 *
 */
module.exports = function tdr(options){
    var url=''
    , defaultOptions = {
	method:"GET",
	body:null//TODO:json body.
    }
    , opt = defaultOptions;
    
    if(_.isString(options)){
	opt.uri = options;
    }else if( _.isObject(options)){
	opt = _.extend(opt,options);
	opt.uri = opt.uri||opt.url;
	
	if(!URL.parse(opt.uri).search && opt.qs){
	    opt.uri = [opt.uri,_.isPlainObject(opt.qs)?qs.stringify(opt.qs):opt.qs].join("?");
	}
	if(opt.method==='POST'){
	    if(opt.json && _.isPlainObject(opt.body)){//only support one level Object
		var sorted = _.pairs(opt.body).sort(function(a,b){
			return a[0]==b[0]?a[1]>b[1]:a[0]>b[0];
		    }).reduce(function(pre,cur){
			    pre[cur[0]]=cur[1];
			},Object.create(null));
		opt.body = JSON.stringify(sorted);
	    }else if(opt.form){
		_.isString(opt.form)
	    }
	}
    }else{
	throw "options should be String or Object.";
    }
    
    return [[opt.method,URL.normalize(opt.uri)].join(" "),opt.body].join("\r\n");
}