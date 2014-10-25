// **Github:** https://github.com/zensh/thunk-stream
//
// **License:** MIT

/* global module, define */
'use strict';
var Thunk = require('thunks')();

module.exports = function thunkStream(stream, options) {
  options = options || {};
  var endEventTypes = ['end', 'finish', 'close'];
  var endEventType = options.endEventType || [];

  if (!Array.isArray(endEventType)) endEventType = [endEventType];

  endEventType.forEach(function (type) {
    if (type && typeof type === 'string' && endEventTypes.indexOf(type) < 0) endEventTypes.push(type);
  });

  return Thunk(function (callback) {

    function onend() {
      removeListener();
      process.nextTick(function () {
        callback();
      });
    }

    function onerror(error) {
      removeListener();
      process.nextTick(function () {
        callback(error);
      });
    }

    function removeListener() {
      stream.removeListener('error', onerror);
      endEventTypes.forEach(function (type) {
        stream.removeListener(type, onend);
      });
    }

    function onrequest() {
      stream.req.on('finish', onend);
    }

    if (options.error !== false) stream.on('error', onerror);

    endEventTypes.forEach(function (type) {
      if (options[type] !== false) stream.on(type, onend);
    });
  });
};
