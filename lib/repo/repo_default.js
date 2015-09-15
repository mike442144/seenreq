var create = require("lodash/object/create")
var crypto = require('crypto')
var base = require("./repo.js")

function MemRepo(options){
    this.cache = Object.create(null);
}

MemRepo.prototype = create(base.prototype,{
    "constructor":MemRepo
});

MemRepo.prototype.exists = function(opt){
    var req=null
    , update = true;
    
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
    
    if(key in this.cache){
	return true;
    }
    
    if(update !== false){
	this.cache[key]=null;
    }
    
    return false;
}

module.exports = MemRepo;
