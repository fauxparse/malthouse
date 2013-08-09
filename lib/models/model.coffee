mongojs = require "mongojs"

MONGO_URI = process.env.MONGOLAB_URI || "mongodb://localhost/malthouse"

class Model
  @KEYS: [ ]
  
  constructor: (attributes) ->
    @load attributes
    
  load: (attributes) ->
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
    json._id = @_id if @_id?
    json
  
  attributesToSave: -> @toJSON()
  
  save: (callback) ->
    @constructor.collection().save @attributesToSave(), (error) =>
      callback(error, this)
      
  update: (attributes, callback) ->
    @load attributes
    @save callback
    
  @find: (criteria, callback) ->
    @collection().find criteria, (error, docs) =>
      callback error, (new this(attrs) for attrs in docs)
  
  @findOne: (criteria, callback) ->
    @collection().find criteria, (error, docs) =>
      doc = if error then undefined else new this(docs[0])
      callback error, doc
  
  @create: (attributes, callback) ->
    record = new this(attributes)
    record.save callback
    
  @db: ->
    @_db ?= mongojs MONGO_URI
    
  @collection: ->
    @_collection ?= Model.db().collection @COLLECTION
      
module.exports = Model