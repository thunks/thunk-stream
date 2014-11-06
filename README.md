thunk-stream v0.1.3 [![Build Status](https://travis-ci.org/zensh/thunk-stream.svg)](https://travis-ci.org/zensh/thunk-stream)
====
Wrap a readable/writable/duplex/transform stream to a thunk.

## [thunks](https://github.com/teambition/thunks)


## Demo

```js
var thunkStream = require('thunk-stream'),
  stream = require('stream'),
  fs = require('fs');

var readableStream = fs.createReadStream('index.js');
var passStream = new stream.PassThrough();

thunkStream(readableStream)(function (error) {
  if (error) console.error('error', error);
  else console.log('read file end.')
});

thunkStream(passStream)(function (error) {
  console.log('file pass through finished.')
});

readableStream.pipe(passStream);
```

## Installation

```bash
npm install thunk-stream
```

## API

```js
var thunkStream = require('thunk-stream');
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
