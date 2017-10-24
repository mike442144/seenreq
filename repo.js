
'use strict'

const crypto = require('crypto')

/* Repo is an abstract class
 *
 *
 */
class Repo{
    initialize(callback){
	process.nextTick(callback);
    }

    /*
     * - normalizedReq, Array
     *   - sign, String
     *   - options, Object, this is options for one request
     * - options, Object, this is options for all requests
     * - callback, Function
     *
     * Priority of two options : normalizedReq.options > options
     */
    exists(normalizedReq, options, callback){
	let req = normalizedReq,
	slots = {},
	uniq = [],
	keysToInsert = {},
	rst = new Array(req.length);

	for (var i = 0; i < req.length; i++) {
	    let reqOptions = Object.assign({},options,req[i].options);
	    let key = this.transformKey(req[i].sign);
	    if (key in slots) {
		rst[i] = true;
	    } else {
		rst[i] = false;
		slots[key] = i;
		uniq.push(key);
		keysToInsert[key] = null;
		
		if (reqOptions.rupdate === false) {
		    delete keysToInsert[key];
		}
	    }
	}
	
	this.getByKeys(uniq, (err, result) => {
	    if (err)
		return callback(err);
	    
	    let ifTruthy = function(key){ return key==='1' || key===1 || key==='true' || key===true};
	    for (var j = 0; j < uniq.length; j++) {
		if (ifTruthy(result[j])) {
		    rst[slots[uniq[j]]] = true;
		    delete keysToInsert[uniq[j]];
		} else {
		    rst[slots[uniq[j]]] = false;
		}
	    }

	    this.setByKeys(Object.keys(keysToInsert), (err) => {
		if (err)
		    return callback(err);

		callback(null, rst);
	    });
	})
    }

    /*
     * 
     * @return Array, transformed keys
     *
     */
    transformKey(key){
	let hash = function(str) {
            let hashFn = crypto.createHash('md5');
            hashFn.update(str);
            return hashFn.digest('hex');
	}
	
	return hash(key);
    }

    dispose(){
	throw new Error("`dispose` not implemented");
    }
}

module.exports = Repo
