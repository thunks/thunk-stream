'use strict';
/*global describe, it, before, after, beforeEach, afterEach*/

var should = require('should'),
  thunkStream = require('../index.js'),
  stream = require('stream'),
  fs = require('fs');

describe('thunk-stream', function () {
  it('thunkStream(readableStream) success', function (done) {
    var readableStream = fs.createReadStream('index.js');
    var passStream = new stream.PassThrough();

    var readableStreamEnded = false;

    thunkStream(readableStream)(function (error) {
      should(error).be.equal(null);
      should(readableStream.closed).be.equal(true);
      should(readableStreamEnded).be.equal(false);
      readableStreamEnded = true;
    });

    thunkStream(passStream)(function (error) {
      should(error).be.equal(null);
      should(readableStreamEnded).be.equal(true);
    })(done);

    readableStream.pipe(passStream);
  });

  it('thunkStream(readableStream) error', function (done) {
    var readableStream = fs.createReadStream('none.js');
    var passStream = new stream.PassThrough();

    thunkStream(readableStream)(function (error) {
      should(error).be.instanceOf(Error);
      should(readableStream.destroyed).be.equal(true);
    })(done);

    thunkStream(passStream)(function (error) {
      should('this function will not run').be.equal('');
    });

    readableStream.pipe(passStream);
  });

  it('thunkStream(writableStream) success', function (done) {
    var readableStream = fs.createReadStream('index.js');
    var writableStream = new stream.Writable();
    var readableStreamEnded = false;

    writableStream._write = function(chunk, encoding, cb) {
      cb(null, chunk);
    };

    thunkStream(readableStream)(function (error) {
      should(error).be.equal(null);
      should(readableStream.closed).be.equal(true);
      should(readableStreamEnded).be.equal(false);
      readableStreamEnded = true;
    });

    thunkStream(writableStream)(function (error) {
      should(error).be.equal(null);
      should(readableStreamEnded).be.equal(true);
    })(done);

    readableStream.pipe(writableStream);
  });

});