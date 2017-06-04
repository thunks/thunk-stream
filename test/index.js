'use strict'

const assert = require('assert')
const thunkStream = require('../index.js')
const stream = require('stream')
const fs = require('fs')
const tman = require('tman')

tman.suite('thunk-stream', function () {
  tman.it('thunkStream(readableStream) success', function (done) {
    let readableStream = fs.createReadStream('index.js')
    let passStream = new stream.PassThrough()

    let readableStreamEnded = false

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

  tman.it('thunkStream(readableStream) error', function (done) {
    let readableStream = fs.createReadStream('none.js')
    let passStream = new stream.PassThrough()

    thunkStream(readableStream)(function (error) {
      assert.strictEqual(error instanceof Error, true)
      assert.strictEqual(readableStream.destroyed, true)
    })(done)

    thunkStream(passStream)(function (_) {
      assert.strictEqual('this function will not run', '')
    })

    readableStream.pipe(passStream)
  })

  tman.it('thunkStream(writableStream) success', function (done) {
    let readableStream = fs.createReadStream('index.js')
    let writableStream = new stream.Writable()
    let readableStreamEnded = false

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

  tman.it('thunkStream(writableStream).clearListeners()', function (done) {
    let readableStream = fs.createReadStream('index.js')
    let writableStream = new stream.Writable()

    writableStream._write = function (chunk, encoding, cb) {
      cb(null, chunk)
    }

    thunkStream(readableStream)(function (error) {
      assert.strictEqual(error, null)
      assert.strictEqual(readableStream.closed, true)
    })

    let thunk = thunkStream(writableStream)
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
