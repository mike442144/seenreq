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
A library to test if a url/request is crawled, usually used in a web crawler. Compatible with [request](https://github.com/request/request) and [node-crawler](https://github.com/bda-research/node-crawler). The 1.x or newer version has quite different APIs and is not compatible with 0.x versions. Please read the [upgrade guide](./UPGRADE.md) document.

# Table of Contents

* [Quick Start](#quick-start)
  * [Installation](#installation)
  * [Basic Usage](#basic-usage)
  * [Use Redis](#use-redis)
  * [Use Mongodb](#use-mongodb)
* [Class:seenreq](#classseenreq)
  * [seen.initialize()](#seeninitialize)
  * [seen.normalize(uri|option[,options])](#seennormalizeurioptionoptions)
  * [seen.exists(uri|option|array[,options])](#seenexistsurioptionarrayoptions)
  * [seen.dispose()](#seen_dispose)
* [Options](#options)

## Quick Start

### Installation

    $ npm install seenreq --save

### Basic Usage

```javascript
const seenreq = require('seenreq')
, seen = new seenreq();

//url to be normalized
let url = "http://www.GOOGLE.com";
console.log(seen.normalize(url));//{ sign: "GET http://www.google.com/\r\n", options: {} }

//request options to be normalized
let option = {
    uri: 'http://www.GOOGLE.com',
    rupdate: false
};

console.log(seen.normalize(option));//{sign: "GET http://www.google.com/\r\n", options:{rupdate: false} }

seen.initialize().then(()=>{
    return seen.exists(url);
}).then( (rst) => {
    console.log(rst[0]);//false if ask for a `request` never see
    return seen.exists(opt);
}).then( (rst) => {
    console.log(rst[0]);//true if got same `request`
}).catch(e){
    console.error(e);
};
```
When you call `exists`, the module will do normalization itself first and then check if exists.

### Use Redis
`seenreq` stores keys in memory by default, memory usage will soar as number of keys increases. Redis will solve this problem. Because seenreq uses `ioredis` as redis client, all `ioredis`' [options](https://github.com/luin/ioredis/blob/master/API.md) are recived and supported. You should first install:

```javascript
npm install seenreq-repo-redis --save
```
and then set repo to `redis`:

```javascript
const seenreq = require('seenreq')
let seen = new seenreq({
    repo:'redis',// use redis instead of memory
    host:'127.0.0.1', 
    port:6379,
    clearOnQuit:false // clear redis cache or don't when calling dispose(), default true.
});

seen.initialize().then(()=>{
    //do stuff...
}).catch(e){
    console.error(e);
}
```

### Use mongodb
It is similar with redis above:

```javascript
npm install seenreq-repo-mongo --save
```

```javascript
const seenreq = require('seenreq')
let seen = new seenreq({
    repo:'mongo',
    url:'mongodb://xxx/seenreq',
    collection: 'foor'
});
```


## Class:seenreq

Instance of seenreq

### __seen.initialize()__
Initialize the repo, returns a promise.

### __seen.normalize(uri|option[,options])__
 * `uri` String, `option` is Option of [request](https://github.com/request/request) or [node-crawler](https://github.com/bda-research/node-crawler)
 * [options](#options)

Returns normalized Object: {sign,options}.

### __seen.exists(uri|option|array[,options])__
 * uri|option
 * [options](#options)

Returns a promise with an Boolean array, e.g. [true, false, true, false, false].

### __seen.dispose()__

Dispose resources of repo. If you are using repo other than memory, like Redis you should call `dispose` to release connection. Returns a promise.

## Options

 * removeKeys: Array, Ignore specified keys when doing normalization. For instance, there is a `ts` property in the url like `http://www.xxx.com/index?ts=1442382602504` which is timestamp and it should be same whenever you visit.
 * stripFragment: Boolean, Remove the fragment at the end of the URL (Default true).
 * rupdate: Boolean, it is short for `repo update`. Store in repo so that `seenreq` can hit the same `req` next time (Default true).

# RoadMap
 * add `mysql` repo to persist keys to disk.
 * add keys life time management.
