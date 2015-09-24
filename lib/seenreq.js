function seenreq(options){
    var Repo = require("./repo/repo_"+((options && options.repo)||"default")+".js");
    this.repo = new Repo(options);
    this.normalizer = require("./normalizer/normalizer_"+((options&&options.normalizer)||"default")+".js");
}

seenreq.prototype.normalize = function(req,options){
    return this.normalizer.normalize(req,options);
}

seenreq.prototype.exists = function(req,options){
    if(!(req instanceof Array)){
	req = [req];
    }
    var self = this
    , cb = null;
    
    if(typeof options=="function"){
	cb = options;
	options = null;
    }else if(typeof options=='object'){
	cb = options.callback;
	delete options.callback;
    }
    
    var rs = req.map(function(r){return self.normalize(r,options);});
    return this.repo.exists(rs,cb);
}

seenreq.prototype.dispose = function(){
    this.repo.dispose();
}

module.exports = seenreq
