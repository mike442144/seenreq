'use strict'

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
    return req;
}

module.exports = Normalizer;
