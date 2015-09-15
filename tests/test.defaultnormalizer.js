var assert = require("assert")
var seenreq = require("../lib/seenreq.js")
var seen = new seenreq();

assert.equal("GET http://www.google.com/\r\n",seen.normalize("http://www.GOOGLE.com"));

assert.equal("GET https://www.google.com.hk/?ei=qg5QVYyVBcrC8Afz6ICoDw&gfe_rd=cr&gws_rd=ssl&q=how%20to%20test%20url%20duplicate&safe=strict\r\n",seen.normalize("https://www.google.com.hk/?gfe_rd=cr&ei=qg5QVYyVBcrC8Afz6ICoDw&gws_rd=ssl&safe=strict&q=how+to+test+url+duplicate"));

var opt = {
    uri:"http://www.google.com"
};

assert.equal("GET http://www.google.com/\r\n",seen.normalize(opt));

opt = {
    url:"http://www.GOOGLE.com"
}

assert.equal("GET http://www.google.com/\r\n",seen.normalize(opt));

assert.equal("GET http://stackoverflow.com/questions/\r\n",seen.normalize("http://stackoverflow.com/questions/"));

opt = {
    uri:"http://www.GOOGLE.com",
    qs:{
	q:"How to do request seen test"
    }
}

assert.equal("GET http://www.google.com/?q=How%20to%20do%20request%20seen%20test\r\n",seen.normalize(opt));

opt = {
    method:'GET',
    uri:"http://www.google.com",
    qs:{
	q:"How to do request seen test",
	gfe_rd:'cr',
	ei:'qg5QVYyVBcrC8Afz6ICoDw',
	gws_rd:'ssl',
	safe:'strict'
    }
}

assert.equal("GET http://www.google.com/?ei=qg5QVYyVBcrC8Afz6ICoDw&gfe_rd=cr&gws_rd=ssl&q=How%20to%20do%20request%20seen%20test&safe=strict\r\n",seen.normalize(opt));

var opt_form = {
    method:"POST",
    uri:"https://github.com/logout",
    form:{
	utf8:'✓',
	authenticity_token:'R1d7nfjekS+a5/h8+L2DrSy02gt7GCxRLFla5JBjwMrYQRDRrGPaTFz/tHTQKaqYfMeZIYlYMhfBrnMwDDz+cg=='
    }
}

assert.equal("POST https://github.com/logout\r\nauthenticity_token=R1d7nfjekS+a5/h8+L2DrSy02gt7GCxRLFla5JBjwMrYQRDRrGPaTFz/tHTQKaqYfMeZIYlYMhfBrnMwDDz+cg==&utf8=✓",seen.normalize(opt_form));

opt = {
    method:"POST",
    uri:"https://github.com/logout",
    form:"utf8=✓&authenticity_token=R1d7nfjekS+a5/h8+L2DrSy02gt7GCxRLFla5JBjwMrYQRDRrGPaTFz/tHTQKaqYfMeZIYlYMhfBrnMwDDz+cg=="
}

assert.equal(seen.normalize(opt_form),seen.normalize(opt));

var opt_body = {
    method:"POST",
    uri:"https://github.com/logout",
    body:{
	utf8:'✓',
	authenticity_token:'R1d7nfjekS+a5/h8+L2DrSy02gt7GCxRLFla5JBjwMrYQRDRrGPaTFz/tHTQKaqYfMeZIYlYMhfBrnMwDDz+cg=='
    },
    json:true
}

assert.equal('POST https://github.com/logout\r\n{"authenticity_token":"R1d7nfjekS+a5/h8+L2DrSy02gt7GCxRLFla5JBjwMrYQRDRrGPaTFz/tHTQKaqYfMeZIYlYMhfBrnMwDDz+cg==","utf8":"✓"}',seen.normalize(opt_body));

assert.equal("GET http://www.google.com/\r\n",seen.normalize("http:\/\/www.GOOGLE.com/"));
//assert.equal("GET http://www.google.com/\r\n",seen.normalize("http://www.GOOGLE.com#abc=124"));

