mongojs = require "mongojs"

MONGO_URI = process.env.MONGOLAB_URI || "mongodb://localhost/malthouse"

class Model
  @KEYS: [ ]
  
  constructor: (attributes) ->
    @set(key, value) for own key, value of attributes
    
  set: (key, value) ->
    if typeof @[key] is "function"
      @[key] value
    else
      @[key] = value
      
  get: (key) ->
    if typeof @[key] is "function"
      @[key]()
    else
      @[key]
        
  toJSON: ->
    json = {}
    json[key] = @get(key) for key in @constructor.KEYS
    json
  
  save: (callback) ->
    @constructor.collection().save @toJSON(), =>
      callback(null, this)
  
  @create: (attributes, callback) ->
    record = new this(attributes)
    record.save callback
    
  @db: ->
    @_db ?= mongojs MONGO_URI
    
  @collection: ->
    @_collection ?= Model.db().collection @COLLECTION
      
module.exports = Model