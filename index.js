
'use strict';

const URL = require('node-url-utils');

/*
 *
 *
 */

function seenreq(options) {
	let Repo = null;
	const Normalizers = [];
    
	options = options || {};
	if(!options.repo || options.repo==='default' || options.repo==='memory'){
		Repo = require('./lib/repo/default.js');
	}else{
		const moduleName = `seenreq-repo-${options.repo}`;
		try{
			Repo = require(moduleName);
		}catch(e){
			console.error(`\nCannot load module ${moduleName}, please run 'npm install ${moduleName}' and retry\n`);
			throw e;
		}
	}
    
	this.repo = new Repo(options);
    
	if(!options.normalizer){
		Normalizers.push(require('./lib/normalizer/default.js'));
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
seenreq.prototype.initialize = function(){
	return this.repo.initialize();
};

/* Generate method + full uri + body string.
 * - req, String|Object
 * - [options], Object
 * @return, Object. e.g {sign, options}
 */
seenreq.prototype.normalize = function(req, options) {
	if(!req){
		throw new Error('Argument req is required.');
	}
    
	const opt = {
		method: 'GET',
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
	const normalizedRequest = this.normalizers.reduce((r, cur) => cur.normalize(r,options), opt);
	const  sign = [
		[normalizedRequest.method, URL.normalize(normalizedRequest.uri, options)].join(' '), normalizedRequest.body
	].join('\r\n');
    
	const requestArgsSet = new Set(['uri','url','qs','method','headers','body','form','json','multipart','followRedirect','followAllRedirects', 'maxRedirects','encoding','pool','timeout','proxy','auth','oauth','strictSSL','jar','aws','gzip','time','tunnel','proxyHeaderWhiteList','proxyHeaderExclusiveList','localAddress','forever']);
    
	Object.keys(normalizedRequest).filter(key => !requestArgsSet.has(key) ).forEach(key=>options[key]=normalizedRequest[key]);
	return {sign,options};
};

seenreq.prototype.exists = function(req, options) {
	if(!req){
		throw new Error('Argument req is required.');
	}

	if (!(req instanceof Array)) {
		req = [req];
	}
	
	const rs = req.map(r=>this.normalize(r,options));
	return this.repo.exists(rs, options).then( rst => rst.length == 1 ? rst[0] : rst);
};

seenreq.prototype.dispose = function() {
	return this.repo.dispose();
};

module.exports = seenreq;
