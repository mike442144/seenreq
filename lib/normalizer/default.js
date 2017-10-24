
'use strict'

const URL = require('node-url-utils')
, qs = require('querystring')
, Normalizer = require('../../normalizer.js')

class DefaultNormalizer extends Normalizer{
    constructor(options){
	super(options);
	this.globalOptions = options || {};
    }

    /*
     * Generate method + full uri + body string.
     * - req, Object
     * - [options], Object
     */
    
    normalize(req, options) {
	options = options || {};

	if (!URL.parse(req.uri).search && req.qs) {
            req.uri = [req.uri, qs.stringify(req.qs) ].join("?");
	}

	if (req.method === 'POST') {
            if (req.json && typeof req.body === 'object') { //only support one level Object
		let sorted = Object.keys(req.body).map(k => [k, req.body[k]]).sort(function(a, b) {
                    return a[0] === b[0] ? a[1] > b[1] : a[0] > b[0];
		}).reduce(function(pre, cur) {
                    pre[cur[0]] = cur[1];
                    return pre;
		}, Object.create(null));
		req.body = JSON.stringify(sorted);
            } else if (typeof req.form === 'object') {
		req.body = Object.keys(req.form).map(function(k) {
                    return [k, req.form[k]].join("=");
		}).sort().join("&");
            } else if (typeof req.form === 'string') {
		req.body = req.form.split("&").sort().join("&");
            }
	}
	
	let opts = Object.assign({},this.globalOptions, options);
	if (opts.stripFragment !== false) {
            req.uri = req.uri.replace(/#.*/g, '');
	}
	
	return req;
    }    
}

module.exports = DefaultNormalizer;
