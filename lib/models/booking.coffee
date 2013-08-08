Model = require "./model"
Show = require "./show"

class Booking extends Model
  @COLLECTION: "bookings"
  @KEYS: [ "reference", "show_id", "date", "name", "email", "phone", "tickets", "payment", "paid" ]
  
  constructor: (attributes) ->
    @paid = false
    super
    
  @reference: (show_id, callback) ->
    counters = @db().collection("counters")
    counters.find { name: "guid" }, (err, docs) =>
      counter = (docs[0]?.value or 13247) + 1
      counters.save name: "guid", value: counter
      callback null, "#{show_id.toUpperCase()}-#{counter}"
    
  @create: (attributes, callback) ->
    @reference attributes.show_id, (err, reference) =>
      record = new this(attributes)
      record.reference = reference
      record.save callback

Booking.collection().ensureIndex "reference", unique: true
Booking.collection().ensureIndex show_id: 1, date: 1

module.exports = Booking