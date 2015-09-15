var assert = require("assert")
var seenreq = require("../lib/seenreq.js")
var seen = new seenreq({repo:"redis"});

seen.exists("http://mall.autohome.com.cn/list/0-110100-0-0-0-0-0-0-0-1.html",{callback:function(err,result){
    if(err){
	console.error(err);
    }else{
	console.log(result);
	assert.equal(0,result);
    }

    seen.exists("http://mall.autohome.com.cn/list/0-110100-0-0-0-0-0-0-0-1.html",{callback:function(err,result){
	if(err){
	    console.error(err);
	}else{
	    console.log(result);
	    assert.equal(1,result);
	}
    }})
}})

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

seen.exists(opt,{callback:function(err,result){
    if(err){
	console.error(err);
    }else{
	console.log(result);
	assert.equal(0,result);
    }


    seen.exists(opt2,{callback:function(err,result){
	if(err){
	    console.error(err);
	}else{
	    console.log(result);
	    assert.equal(0,result);
	}
	seen.dispose();
    }});
    
}});


