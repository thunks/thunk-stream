thunk-stream
====
Wrap a readable/writable/duplex/transform stream to a thunk.

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]

## [thunks](https://github.com/thunks/thunks)

## Demo

```js
var thunkStream = require('thunk-stream')
var stream = require('stream')
var fs = require('fs')

var readableStream = fs.createReadStream('index.js')
var passStream = new stream.PassThrough()

thunkStream(readableStream)(function (error) {
  if (error) console.error('error', error)
  else console.log('read file end.')
})

thunkStream(passStream)(function (error) {
  console.log('file pass through finished.')
})

readableStream.pipe(passStream)
```

## Installation

```bash
npm install thunk-stream
```

## API

```js
var thunkStream = require('thunk-stream')
```

### thunkStream(stream[, options])

Return a thunk function.

#### stream

*Required*, Type: `stream`, readable/writable/duplex/transform stream.

#### options.endEventType

*Optional*, Type: `String` or `Array`

Appoint one or more event types to delegate the stream end. In built end event types: `['end', 'finish', 'close', 'error']`.

#### options.error

*Optional*, Type: `Boolean`

If `true`, ignore `error` event for stream end.

#### options.end

*Optional*, Type: `Boolean`

If `true`, ignore `end` event for stream end.

#### options.finish

*Optional*, Type: `Boolean`

If `true`, ignore `finish` event for stream end.

#### options.close

*Optional*, Type: `Boolean`

If `true`, ignore `close` event for stream end.

#### options[eventType]

*Optional*, Type: `Boolean`

If `true`, ignore `eventType` event for stream end.

### thunk.clearListeners()

After thunk is called, `clearListeners` is added that can remove all listeners  added to stream by `thunkStream`. if listeners has been removed already, it return `false`, else return `true`.

[npm-url]: https://npmjs.org/package/thunk-stream
[npm-image]: http://img.shields.io/npm/v/thunk-stream.svg

[travis-url]: https://travis-ci.org/thunks/thunk-stream
[travis-image]: http://img.shields.io/travis/thunks/thunk-stream.svg
