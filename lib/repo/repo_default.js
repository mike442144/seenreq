var create = require("lodash/object/create")
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
    
    if(req in this.cache){
	return true;
    }
    
    if(update !== false)
	this.cache[req]=null;
    return false;
}

module.exports = new MemRepo();
