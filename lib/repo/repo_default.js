var crypto = require('crypto')
var base = require("./repo.js")

function MemRepo(options){
    this.cache = Object.create(null);
}

MemRepo.prototype = Object.create(base.prototype);
MemRepo.prototype.constructor = MemRepo;


MemRepo.prototype.exists = function(opt,callback){
    var req=null
    , update = true;
    
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
	return hashFn.digest('hex');// to 32bit hex string
    }
    
    var result = req.map(function(r){
	var key = hash(r);
	if(key in this.cache)
	    return true;
	
	if(update !== false)
	    this.cache[key]=null;
	
	return false;
    },this);
    
    if(callback){
	callback(null,result);
    }
    
    return result.length===1?result[0]:result;
}

MemRepo.prototype.dispose = function(){
    
}

module.exports = MemRepo;
