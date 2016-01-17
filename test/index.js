'use strict'
/* global describe, it */

var assert = require('assert')
var thunkStream = require('../index.js')
var stream = require('stream')
var fs = require('fs')

describe('thunk-stream', function () {
  it('thunkStream(readableStream) success', function (done) {
    var readableStream = fs.createReadStream('index.js')
    var passStream = new stream.PassThrough()

    var readableStreamEnded = false

    thunkStream(readableStream)(function (error) {
      assert.strictEqual(error, null)
      assert.strictEqual(readableStream.closed, true)
      assert.strictEqual(readableStreamEnded, false)
      readableStreamEnded = true
    })

    thunkStream(passStream)(function (error) {
      assert.strictEqual(error, null)
      assert.strictEqual(readableStreamEnded, true)
    })(done)

    readableStream.pipe(passStream)
  })

  it('thunkStream(readableStream) error', function (done) {
    var readableStream = fs.createReadStream('none.js')
    var passStream = new stream.PassThrough()

    thunkStream(readableStream)(function (error) {
      assert.strictEqual(error instanceof Error, true)
      assert.strictEqual(readableStream.destroyed, true)
    })(done)

    thunkStream(passStream)(function (_) {
      assert.strictEqual('this function will not run', '')
    })

    readableStream.pipe(passStream)
  })

  it('thunkStream(writableStream) success', function (done) {
    var readableStream = fs.createReadStream('index.js')
    var writableStream = new stream.Writable()
    var readableStreamEnded = false

    writableStream._write = function (chunk, encoding, cb) {
      cb(null, chunk)
    }

    thunkStream(readableStream)(function (error) {
      assert.strictEqual(error, null)
      assert.strictEqual(readableStream.closed, true)
      assert.strictEqual(readableStreamEnded, false)
      readableStreamEnded = true
    })

    thunkStream(writableStream)(function (error) {
      assert.strictEqual(error, null)
      assert.strictEqual(readableStreamEnded, true)
    })(done)

    readableStream.pipe(writableStream)
  })

  it('thunkStream(writableStream).clearListeners()', function (done) {
    var readableStream = fs.createReadStream('index.js')
    var writableStream = new stream.Writable()

    writableStream._write = function (chunk, encoding, cb) {
      cb(null, chunk)
    }

    thunkStream(readableStream)(function (error) {
      assert.strictEqual(error, null)
      assert.strictEqual(readableStream.closed, true)
    })

    var thunk = thunkStream(writableStream)
    // clearListeners is add after thunk called.
    assert.strictEqual(thunk.clearListeners, undefined)
    thunk(function (_) {
      assert.strictEqual('This should not run!', true)
    })
    thunk.clearListeners()
    writableStream.on('finish', done)

    readableStream.pipe(writableStream)
  })
})
