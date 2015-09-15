var assert = require("assert")
var seenreq = require("../lib/seenreq.js")
var seen = new seenreq();

assert.equal(false,seen.exists("http://mall.autohome.com.cn/list/0-110100-0-0-0-0-0-0-0-1.html"));
assert.equal(true,seen.exists("http://mall.autohome.com.cn/list/0-110100-0-0-0-0-0-0-0-1.html"));

var opt = {
    uri:"http://baoming.xdf.cn/ShoppingCart/Handlers/getCartVoucherHandler.ashx",
    method:'POST',
    form:{
	s:"a"
    },
    headers:{
	Cookie:"Xdf.WebPay.V4.Cart="+""
    },
    jQuery:false
}

var opt2 = {
    uri:"http://baoming.xdf.cn/ShoppingCart/Handlers/getCartVoucherHandler.ashx",
    method:'POST',
    form:{
	s:"b"
    },
    headers:{
	Cookie:"Xdf.WebPay.V4.Cart="+""
    },
    jQuery:false
}

assert.equal(false,seen.exists(opt));
assert.equal(false,seen.exists(opt2));
