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
	password: '',
	db: 0,
	path:null,
	keepAlive:0,
	enableReadyCheck:true,
	enableOfflineQueue:true,
	connectTimeout:10000,
	autoResubscribe:true,
	autoResendUnfulfilledCommands:true,
	lazyConnect:false,
	keyPrefix:'',
	retryStrategy:function (times) {
	    var delay = Math.min(times * 2, 2000);
	    return delay;
	}
    }
    
    this.redis = new Redis(_.assign(options,defaultOptions));
}

RedisRepo.prototype = create(base.prototype,{
    "constructor":RedisRepo
});

RedisRepo.prototype.exists = function(opt,callback){
    var req=null
    , update = true
    , self = this;
    
    if(typeof opt === "string"){
	req = opt;
    }
    else if(typeof opt === 'object'){
	update = opt.update;
	req = opt.req;
    }else{
	throw new Error("illegal arguments");
    }
    
    var hash = function(str){
	var hashFn = crypto.createHash('md5');
	hashFn.update(str);
	return hashFn.digest('hex');// to 32bit hex string
    }
    
    var key = hash(req);
    
    this.redis.get(key,function(err,result){
	if(err){
	    callback(err);
	}else{
	    if(update !== false){
		self.redis.set(key,1);
	    }
	    callback(null,result);
	}
    });
}

RedisRepo.prototype.dispose = function(){
    this.redis.quit();
}

module.exports = RedisRepo;

