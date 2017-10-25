[![NPM](https://nodei.co/npm/seenreq.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/seenreq/)

[![build status](https://secure.travis-ci.org/mike442144/seenreq.png)](https://travis-ci.org/mike442144/seenreq)
[![Dependency Status](https://david-dm.org/mike442144/seenreq/status.svg)](https://david-dm.org/mike442144/seenreq)
[![NPM download][download-image]][download-url]
[![NPM quality][quality-image]][quality-url]

[quality-image]: http://npm.packagequality.com/shield/seenreq.svg?style=flat-square
[quality-url]: http://packagequality.com/#?package=seenreq
[download-image]: https://img.shields.io/npm/dm/seenreq.svg?style=flat-square
[download-url]: https://npmjs.org/package/seenreq

# seenreq
A library to test if a url/request is crawled, usually used in a web crawler. Compatible with [request](https://github.com/request/request) and [node-crawler](https://github.com/bda-research/node-crawler). The 1.0.0 or newer version has quite different APIs and is not compatible with previous versions. Please read the [upgrade guide](./UPGRADE.md) document.


# Install

    $ npm install seenreq

# Basic Usage

```javascript
var seenreq = require('seenreq')
var seen = new seenreq();

//url to be normalized
var url = "http://www.GOOGLE.com";
console.log(seen.normalize(url));//{ sign: "GET http://www.google.com/\r\n", options: {} }

//request options to be normalized
var option = {
    uri:'http://www.GOOGLE.com'
};

console.log(seen.normalize(option));//{sign: "GET http://www.google.com/\r\n", options:{} }

//return false if ask for a `request` never see
seen.exists(url,(e, rst)={
    console.log(rst[0]);//false
});

//return true if got same `request`
seen.exists(opt,(e, rst)=>{
    console.log(rst[0]);//true
});
```
When you call `exists`, the module will do normalization itself first and then check if exists.

# Use Redis
`seenreq` default stores keys in memory, so process will use unlimited memory if there are unlimited keys. Redis will solve this problem. Because seenreq uses `ioredis` as redis client, all `ioredis`' [options](https://github.com/luin/ioredis/blob/master/API.md) are recived and supported. You should first install:

```javascript
npm install seenreq-repo-redis
```
and then set repo to `redis`:

```javascript
var seenreq = require('seenreq')
var seen = new seenreq({
    repo:'redis',// use redis instead of memory
    host:'127.0.0.1', 
    port:6379,
    clearOnQuit:false // clear redis cache or don't when calling dispose(), default true.
});
```
Class:seenreq
-------------

Instance of seenreq

__seen.normalize(uri|option[,options])__
 * `uri` String, `option` is Option of `request` or `node-webcrawler`
 * [options](#options)
 * return normalized Object: {sign,options}

__seen.exists(uri|option|array[,options],callback)__
 * uri|option
 * [options](#options)
 * callback

__seen.dispose()__
 * dispose resources of repo. If you are using repo other than memory, like Redis and do not call `dispose`, the connection will keep forever, thus your process will never exit.

Options
-----------------
 * removeKeys: Array, Ignore specified keys when doing normalization. For instance, there is a `ts` property in the url like `http://www.xxx.com/index?ts=1442382602504` which is timestamp and it should be same whenever you visit.
 * stripFragment: Boolean, Remove the fragment at the end of the URL (Default true).
 * rupdate: Boolean, Store in repo so that `seenreq` can hit the same `req` next time (Default true).
 * callback: Function, return result if using Redis repo.

# RoadMap
 * add `mysql` repo to persist keys to disk.
 * add keys life time management.
