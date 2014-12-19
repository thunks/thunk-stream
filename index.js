'use strict';
// **Github:** https://github.com/thunks/thunk-stream
//
// **License:** MIT

var Thunk = require('thunks')();

function forEach(obj, iterator) {
  for (var i = 0, l = obj.length; i < l; i++) iterator(obj[i], i, obj);
}

module.exports = function thunkStream(stream, options) {
  options = options || {};
  var endEventTypes = ['end', 'finish', 'close'];
  var endEventType = options.endEventType || [];

  if (!Array.isArray(endEventType)) endEventType = [endEventType];

  forEach(endEventType, function (type) {
    if (type && typeof type === 'string' && endEventTypes.indexOf(type) < 0) endEventTypes.push(type);
  });

  return Thunk.call(this, function (callback) {

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
      stream.removeListener('error', onerror);
      forEach(endEventTypes, function (type) {
        stream.removeListener(type, onend);
      });
    }

    if (options.error !== false) stream.on('error', onerror);
    forEach(endEventTypes, function (type) {
      if (options[type] !== false) stream.on(type, onend);
    });
  });
};
