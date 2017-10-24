const Repo = require("../../repo")

class MemRepo extends Repo{
    constructor(){
	super();
	this.cache = Object.create(null);
    }

    getByKeys(keys, callback){
	let rst = keys.map(key => key in this.cache);
	process.nextTick(callback,null, rst);
    }

    setByKeys(keys, callback){
	keys.forEach(key => this.cache[key]=null);
	process.nextTick(callback);
    }

    dispose() {
	this.cache = null;
    }
}

module.exports = MemRepo;
