var assert = require("assert")
var seenreq = require("../")
var seen = new seenreq();

seen.exists("http://mall.autohome.com.cn/list/0-110100-0-0-0-0-0-0-0-1.html", (e, rst) =>{
    if(e) return console.error(e);

    assert.equal(false,rst[0] );

    seen.exists("http://mall.autohome.com.cn/list/0-110100-0-0-0-0-0-0-0-1.html", (e, rst) =>{
	if(e) return console.error(e);

	assert.equal(true,rst[0] );
    })
});

var opt = {
    uri: "http://baoming.xdf.cn/ShoppingCart/Handlers/getCartVoucherHandler.ashx",
    method: 'POST',
    form: {
        s: "a"
    },
    headers: {
        Cookie: "Xdf.WebPay.V4.Cart=" + ""
    },
    jQuery: false
}

var opt2 = {
    uri: "http://baoming.xdf.cn/ShoppingCart/Handlers/getCartVoucherHandler.ashx",
    method: 'POST',
    form: {
        s: "b"
    },
    headers: {
        Cookie: "Xdf.WebPay.V4.Cart=" + ""
    },
    jQuery: false
}

seen.exists(opt, (e, rst) =>{
    if(e) return console.error(e);

    assert.equal(false,rst[0] );
});

seen.exists(opt2, (e, rst) =>{
    if(e) return console.error(e);

    assert.equal(false,rst[0] );
});

opt = {
    uri: "http://mall.autohome.com.cn/list/0-110100-0-0-0-0-0-0-0-2.html",
    rupdate: false
}

opt2 = "http://mall.autohome.com.cn/list/0-110100-0-0-0-0-0-0-0-2.html";

var opt3 = {
    uri: "http://mall.autohome.com.cn/list/0-110100-0-0-0-0-0-0-0-2.html",
    rupdate: false
}

seen.exists(opt,(e, rst)=>{
    assert.equal(false, rst[0]);
    seen.exists(opt2, (e, rst)=>{
	assert.equal(false, rst[0]);
	seen.exists(opt3, (e, rst)=>{
	    assert.equal(true, rst[0]);
	});
    });
});
