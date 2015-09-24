var create = require("lodash/object/create")
var crypto = require('crypto')
var base = require("./repo.js")
var MongoClient = require('mongodb').MongoClient
var _ = require('lodash')

function MongoRepo(options){
    this.cache = Object.create(null);
    var mongoUrl = options.mongo||"mongodb://192.168.98.116:27017/test";
    var collectionName = options.collection||"seenreq";
    var self = this;
    MongoClient.connect(mongoUrl,function(err,db){
	if(err) throw err;
	db.collection(self.name).createIndex({_id:1});
	db.collection(self.name).createIndex({key:1,_id:1});
	self.db = db;
    });
}

MongoRepo.prototype = create(base.prototype,{
    "constructor":MongoRepo
});

MongoRepo.prototype.exists = function(opt,callback){
    var req=null
    , update = true
    , self = this;
    
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
    
    var docs = req.map(function(r){
    	return {key:hash(r)};
    });

    this.db.insertManay(docs,function(err,r){
	if(err){
	    callback(err);
	}else{
	    callback(null,r);
	}
    });
}

MongoRepo.prototype.dispose = function(){
    this.db.close();
}

module.exports = MongoRepo;

