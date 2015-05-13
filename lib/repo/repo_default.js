var create = require("lodash/object/create")
var base = require("./repo.js")

function MemRepo(){
    this.cache = {};
}

MemRepo.prototype = create(base.prototype,{
    "constructor":MemRepo
});

MemRepo.prototype.exists = function(str,update){
    if(str in this.cache){
	return true;
    }
    if(update)
	this.cache[str]=null;
    return false;
}

module.exports = new MemRepo();
