# seenreq
A library to test if a url(request) is crawled, usually used in a web crawler. Compatible with `request` and `node-webcrawler`


# Install

    $ npm install seenreq

# Basic Usage

```javascript
var seenreq = require('seenreq')
var seen = new seenreq();

//url to be normalized
var url = "http://www.GOOGLE.com";
console.log(seen.normalize(url));//GET http://www.google.com/\r\n

//request options to be normalized
var option = {
    uri:'http://www.GOOGLE.com'
};

console.log(seen.normalize(option));//GET http://www.google.com/\r\n

//return false if ask for a `request` never see
console.log(seen.exists(url));//false

//return true if got same `request`
console.log(seen.exists(opt));//true
```

