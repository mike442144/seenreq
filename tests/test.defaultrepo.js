var assert = require("assert")
var seenreq = require("../lib/seenreq.js")
var seen = new seenreq();

assert.equal(false,seen.exists("http://mall.autohome.com.cn/list/0-110100-0-0-0-0-0-0-0-1.html"));
assert.equal(true,seen.exists("http://mall.autohome.com.cn/list/0-110100-0-0-0-0-0-0-0-1.html"));
