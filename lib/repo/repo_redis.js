var create = require("lodash/object/create")
var crypto = require('crypto')
var base = require("./repo.js")
var _ = require('lodash')
var Redis = require('ioredis')

function RedisRepo(options){
    this.cache = Object.create(null);
    var defaultOptions = {
	port: 6379,          // Redis port
	host: '127.0.0.1',   // Redis host
	family: 4,           // 4 (IPv4) or 6 (IPv6)
	password: ''
    }

    var options = _.assign(defaultOptions,options);
    this.redis = new Redis(options);
    this.appName = options.appName || 'seenreq';
    this.clearOnQuit = options.clearOnQuit !== false;
}

RedisRepo.prototype = create(base.prototype,{
    "constructor":RedisRepo
});

RedisRepo.prototype.exists = function(opt,callback){
    var req=null
    , update = true
    , self = this
    , slots={}
    , uniq = [];
    
    if(typeof opt === "string"){
	req = [opt];
    }else if(opt instanceof Array){
	req = opt.map(function(r){
	    return typeof r ==='string'?r:r.req;
	});
    }else if(typeof opt === 'object'){
	update = opt.update;
	req = [opt.req];
    }else{
	throw new Error("illegal arguments");
    }

    var hash = function(str){
	var hashFn = crypto.createHash('md5');
	hashFn.update(str);
	return hashFn.digest('hex');
    }

    var rst = new Array(req.length);

    
    for(var i=0;i<req.length;i++){
	if(req[i] in slots){
	    rst[i] = true;
	}else{
	    slots[req[i]] = i;
	    uniq.push(req[i]);
	}
    }
    
    var keys = uniq.map(function(r){return hash(r);});
    
    this.redis.hmget(this.appName,keys,function(err,result){
	if(err){
	    callback(err);
	}else{
	    if(update !== false){
		var tmp = [];
		for(var i=0;i<keys.length;i++){
		    tmp.push(keys[i],1);
		}
		
		self.redis.hmset(self.appName,tmp);
	    }
	    
	    for(var j=0;j<uniq.length;j++){
		rst[slots[uniq[j]]] = result[j]=='1'?true:false;
	    }
	    
	    callback(null,rst);
	}
    });
}

RedisRepo.prototype.dispose = function(){
    var self = this;
    if(this.clearOnQuit){
	this.redis.del(this.appName,function(err,result){
	    if(err)
		throw err;
		
	    self.redis.quit();
	})
    }else{
	self.redis.quit();
    }
}

module.exports = RedisRepo;

