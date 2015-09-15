function seenreq(options){
    var Repo = require("./repo/repo_"+((options && options.repo)||"default")+".js");
    this.repo = new Repo(options);
    this.normalizer = require("./normalizer/normalizer_"+((options&&options.normalizer)||"default")+".js");
}

seenreq.prototype.normalize = function(req,options){
    return this.normalizer.normalize(req,options);
}

seenreq.prototype.exists = function(req,options){
    var r = this.normalize(req,options);
    return this.repo.exists(r,options.callback);
}

seenreq.prototype.dispose = function(){
    this.repo.dispose();
}

module.exports = seenreq
