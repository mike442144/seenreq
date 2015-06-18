function seenreq(options){
    this.repo = require("./repo/repo_"+((options && options.repo)||"default")+".js");
    this.normalizer = require("./normalizer/normalizer_"+((options&&options.normalizer)||"default")+".js");
}

seenreq.prototype.normalize = function(req,options){
    return this.normalizer.normalize(req,options);
}

seenreq.prototype.exists = function(req,options){
    var r = this.normalize(req,options);
    return this.repo.exists(r);
}

module.exports = seenreq
