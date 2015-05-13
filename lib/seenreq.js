function seenreq(options){
    this.repo = require("./repo/repo_"+((options && options.repo)||"default")+".js");
    this.normalizer = require("./normalizer/normalizer_"+((options&&options.normalizer)||"default")+".js");
}

seenreq.prototype.normalize = function(req){
    return this.normalizer.normalize(req);
}

seenreq.prototype.exists = function(req){
    var r = this.normalize(req);
    return this.repo.exists(r);
}

module.exports = seenreq
