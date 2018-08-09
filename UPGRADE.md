# Upgrade guide
## api changes from version below 1.0 to 1.x
 * `exists` are changed to node-style arguments with callback. In previous version it uses memory as default repo to store keys, you can get result by return value but you can't in new version. seenreq uses `process.nextTick` to produce asynchronous callback. So be careful to change your code to get result in callback even if you use defualt memory repo.
 * `normalize` return value is an object now, it looks like: `{sign:"GET http://www.google.com\r\n",options:{key1:"val"}}`, the sign is same as the returned string by normalize before.
 * `options.update` is changed to `options.rupdate` to avoid duplicate, so you can place `rupdate` in `request`, e.g. `{uri:"http://www.google.com", rupdate:false}`. It also takes effect to place it in `options`.
 * Use `initialize` before use `exists`
