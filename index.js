
'use strict'

const URL = require('node-url-utils')

function seenreq(options) {
    let Repo = null
    , Normalizers = [];
    
    options = options || {};
    if(!options.repo || options.repo==='default' || options.repo==='memory'){
	Repo = require("./lib/repo/default.js");
    }else{
	let moduleName = `seenreq-repo-${options.repo}`;
	try{
	    Repo = require(moduleName);
	}catch(e){
	    console.error(`Cannot load module ${moduleName}, please run 'npm install ${moduleName}' and retry`);
	}
    }
    
    this.repo = new Repo(options);
    
    if(!options.normalizer){
	Normalizers.push(require("./lib/normalizer/default.js"));
    }else{
	let moduleNames = null;
	if(typeof options.normalizer === 'string'){
	    moduleNames = [options.normalizer];
	}else{
	    moduleNames = options.normalizer;
	}

	moduleNames.map(moduleName=>{
	    moduleName = `seenreq-nmlz-${moduleName}`;
	    try{
		Normalizers.push(require(moduleName));
	    }catch(e){
		console.error(`Cannot load module ${moduleName}, please run 'npm install ${moduleName}' and retry`);
	    }
	});
    }
    
    this.normalizers = Normalizers.map(ctor => new ctor(options));
    this.globalOptions = options;
}

/* Initialize repo
 * - callback
 *  @return Promise if there is no callback
 */
seenreq.prototype.initialize = function(callback){
    if(callback){
	return this.repo.initialize(callback);
    }
    
    return new Promise((resolve,reject)=>{
	this.repo.initialize((e, arg1, arg2, arg3)=>{
	    if(e)
		return reject(e);

	    if(arg3){
		resolve(arg1,arg2,arg3);
	    }else if(arg2){
		resolve(arg1, arg2);
	    }else if(arg1){
		resolve(arg1);
	    }else{
		resolve();
	    }
	});
    });
}

/* Generate method + full uri + body string.
 * - req, String|Object
 * - [options], Object
 * @return, Object. e.g {sign, options}
 */
seenreq.prototype.normalize = function(req, options) {
    if(!req){
	throw new Error("Argument req is required.");
    }
    
    let opt = {
        method: "GET",
        body: null
    };

    options = Object.assign({},this.globalOptions,options);

    if (typeof req === 'string') {
	opt.uri = req;
    }else if(typeof req === 'object'){
	Object.assign(opt, req);
	opt.uri = opt.uri || opt.url;
    }

    /* A normalizedRequest is an object of request with some modified keys and values */
    let normalizedRequest = this.normalizers.reduce((r, cur) => cur.normalize(r,options), opt)
    , sign = [
        [normalizedRequest.method, URL.normalize(normalizedRequest.uri, options)].join(" "), normalizedRequest.body
    ].join("\r\n");
    
    let requestArgsMap = ['uri','url','qs','method','headers','body','form','json','multipart','encoding','localAddress'].reduce((pre,cur)=>{
	pre[cur]=null;
	return pre;
    },{});
    
    Object.keys(normalizedRequest).filter(key => !(key in requestArgsMap) ).forEach(key=>options[key]=normalizedRequest[key]);
    return {sign,options};
}

seenreq.prototype.exists = function(req, options, callback) {
    if(!req){
	throw new Error("Argument req is required.");
    }

    let cb = null;
    if (!(req instanceof Array)) {
        req = [req];
    }

    if(typeof callback === 'function'){
	cb = callback;
    }else if (typeof options === 'function') {
        cb = options;
        options = null;
    }
    
    let rs = req.map(r=>this.normalize(r,options));
    return this.repo.exists(rs, options, cb);
}

seenreq.prototype.dispose = function() {
    this.repo.dispose();
}

module.exports = seenreq
