'use strict'

var url = require('url')
var base = require('./normalizer.js')

function Normalizer(options){
    this.globalOptions = options||{};
}

Normalizer.prototype = Object.create(base.prototype);
Normalizer.prototype.constructor = Normalizer;

/*
 * Generate method + full uri + body string.
 *
 */
Normalizer.prototype.normalize =  function(req,options){
    req = url.parse(req);
    req.hash = null;
    return url.format(req);
}

module.exports = Normalizer;
