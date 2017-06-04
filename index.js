'use strict'
// **Github:** https://github.com/thunks/thunk-stream
//
// **License:** MIT

const thunk = require('thunks')()
const defaultEndEventTypes = ['end', 'finish', 'close']

function forEach (obj, iterator) {
  for (let i = 0, l = obj.length; i < l; i++) iterator(obj[i], i, obj)
}

module.exports = function thunkStream (stream, options) {
  options = options || {}

  const resultThunk = thunk.call(this, function (callback) {
    const flags = Object.create(null)
    const endEventTypes = []
    const endEventType = options.endEventType
    let clear = false

    function onend () {
      removeListener()
      thunk.delay()(callback)
    }

    function onerror (error) {
      removeListener()
      thunk.delay()(function () {
        callback(error)
      })
    }

    function removeListener () {
      if (!clear) {
        clear = true
        stream.removeListener('error', onerror)
        forEach(endEventTypes, function (type) {
          stream.removeListener(type, onend)
        })
      }
      return clear
    }

    function addListener (type) {
      flags[type] = true
      endEventTypes.push(type)
      stream.on(type, onend)
    }

    resultThunk.clearListeners = removeListener

    if (stream._readableState && stream._readableState.endEmitted) return onend()
    if (stream._writableState && (stream._writableState.finished || stream._writableState.ended)) return onend()

    if (options.error !== false) stream.on('error', onerror)
    forEach(defaultEndEventTypes, function (type) {
      if (options[type] !== false) addListener(type)
    })

    if (!endEventType) return
    forEach(Array.isArray(endEventType) ? endEventType : [endEventType], function (type) {
      if (!flags[type] && options[type] !== false) addListener(type)
    })
  })

  return resultThunk
}
