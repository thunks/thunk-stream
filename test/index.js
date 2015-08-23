'use strict'
/* global describe, it */

var should = require('should')
var thunkStream = require('../index.js')
var stream = require('stream')
var fs = require('fs')

describe('thunk-stream', function () {
  it('thunkStream(readableStream) success', function (done) {
    var readableStream = fs.createReadStream('index.js')
    var passStream = new stream.PassThrough()

    var readableStreamEnded = false

    thunkStream(readableStream)(function (error) {
      should(error).be.equal(null)
      should(readableStream.closed).be.equal(true)
      should(readableStreamEnded).be.equal(false)
      readableStreamEnded = true
    })

    thunkStream(passStream)(function (error) {
      should(error).be.equal(null)
      should(readableStreamEnded).be.equal(true)
    })(done)

    readableStream.pipe(passStream)
  })

  it('thunkStream(readableStream) error', function (done) {
    var readableStream = fs.createReadStream('none.js')
    var passStream = new stream.PassThrough()

    thunkStream(readableStream)(function (error) {
      should(error).be.instanceOf(Error)
      should(readableStream.destroyed).be.equal(true)
    })(done)

    thunkStream(passStream)(function (error) {
      should('this function will not run').be.equal('')
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
      should(error).be.equal(null)
      should(readableStream.closed).be.equal(true)
      should(readableStreamEnded).be.equal(false)
      readableStreamEnded = true
    })

    thunkStream(writableStream)(function (error) {
      should(error).be.equal(null)
      should(readableStreamEnded).be.equal(true)
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
      should(error).be.equal(null)
      should(readableStream.closed).be.equal(true)
    })

    var thunk = thunkStream(writableStream)
    // clearListeners is add after thunk called.
    should(thunk.clearListeners).be.equal(undefined)
    thunk(function (error) {
      should('This should not run!').be.equal(true)
    })
    thunk.clearListeners()
    writableStream.on('finish', done)

    readableStream.pipe(writableStream)
  })

})
