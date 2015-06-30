var create = require("lodash/object/create")
var crypto = require('crypto')
var base = require("./repo.js")

function MemRepo(){
    this.cache = {};
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
	return hashFn.digest('hex');
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

module.exports = new MemRepo();
