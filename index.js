'use strict';
// **Github:** https://github.com/thunks/thunk-stream
//
// **License:** MIT

var Thunk = require('thunks')();
var defaultEndEventTypes = ['end', 'finish', 'close'];

function forEach(obj, iterator) {
  for (var i = 0, l = obj.length; i < l; i++) iterator(obj[i], i, obj);
}

module.exports = function thunkStream(stream, options) {
  options = options || {};

  var thunk = Thunk.call(this, function (callback) {
    var clear = false;
    var flags = Object.create(null);
    var endEventTypes = [];
    var endEventType = options.endEventType;

    function onend() {
      removeListener();
      Thunk.delay(0)(callback);
    }

    function onerror(error) {
      removeListener();
      Thunk.delay(0)(function () {
        callback(error);
      });
    }

    function removeListener() {
      if (!clear) {
        clear = true;
        stream.removeListener('error', onerror);
        forEach(endEventTypes, function (type) {
          stream.removeListener(type, onend);
        });
      }
      return clear;
    }

    function addListener(type) {
      flags[type] = true;
      endEventTypes.push(type);
      stream.on(type, onend);
    }

    thunk.clearListeners = removeListener;

    if (stream._readableState && stream._readableState.endEmitted) return onend();
    if (stream._writableState && (stream._writableState.finished || stream._writableState.ended)) return onend();

    if (options.error !== false) stream.on('error', onerror);
    forEach(defaultEndEventTypes, function (type) {
      if (options[type] !== false) addListener(type);
    });

    if (!endEventType) return;
    forEach(Array.isArray(endEventType) ? endEventType : [endEventType], function (type) {
      if (!flags[type] && options[type] !== false) addListener(type);
    });
  });
  return thunk;
};
