var URL = require('node-url-utils')
var qs = require('querystring')
var _ = require('lodash')
var base = require('./normalizer.js')

function Normalizer(){
    
}

Normalizer.prototype = _.create(base.prototype);

/*
 * Generate method + full uri + body string.
 *
 */
Normalizer.prototype.normalize =  function(req,options){
    var defaultreq = {
	method:"GET",
	body:null
    }
    , opt = JSON.parse(JSON.stringify(defaultreq));
    
    if(_.isString(req)){
	opt.uri = req;
    }else if( _.isObject(req)){
	opt = _.extend(opt,req);
	opt.uri = opt.uri||opt.url;
	
	if(!URL.parse(opt.uri).search && opt.qs){
	    opt.uri = [opt.uri,_.isObject(opt.qs)?qs.stringify(opt.qs):opt.qs].join("?");
	}
	
	if(opt.method==='POST'){
	    if(opt.json && _.isObject(opt.body)){//only support one level Object
		var sorted = _.pairs(opt.body).sort(function(a,b){
		    return a[0]==b[0]?a[1]>b[1]:a[0]>b[0];
		}).reduce(function(pre,cur){
		    pre[cur[0]]=cur[1];
		    return pre;
		},Object.create(null));
		opt.body = JSON.stringify(sorted);
	    }else if(_.isObject(opt.form)){
		opt.body = Object.keys(opt.form).map(function(k){
		    return [k,opt.form[k]].join("=");
		}).sort().join("&");
	    }else if(_.isString(opt.form)){
		opt.body=opt.form.split("&").sort().join("&");
	    }
	}
    }else{
	throw new Error("request should be String or Object.");
    }
    
    return [[opt.method,URL.normalize(opt.uri,options)].join(" "),opt.body].join("\r\n");
}

module.exports = new Normalizer();
