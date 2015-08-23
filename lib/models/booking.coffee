Model = require "./model"
Show = require "./show"

class Booking extends Model
  @COLLECTION: "bookings"
  @KEYS: [ "id", "show_id", "date", "name", "email", "phone", "tickets", "payment", "paid", "amount", "comments" ]

  constructor: (attributes) ->
    @paid = false
    super
    @amount ?= @tickets * @show().price

  show: -> Booking.Show.find @show_id

  @reference: (show, callback) ->
    counters = @db().collection("counters")
    counters.find { name: "guid" }, (err, docs) =>
      counter = (docs[0]?.value or 13247) + 1
      counters.save name: "guid", value: counter, _id: docs[0]?._id
      callback null, "#{show.toUpperCase()}-#{counter}"

  @create: (attributes, callback) ->
    @reference attributes.show_id, (err, reference) =>
      record = new this(attributes)
      record.id = reference
      record.save callback

  @forShow: (show, callback) ->
    @collection().find { show_id: show }, (err, docs) =>
      callback null, (new Booking(attrs) for attrs in docs)

  @created: (booking) =>
    Mailer.sendBookingConfirmation booking

Booking.collection().ensureIndex id: 1, unique: true
Booking.collection().ensureIndex show_id: 1, date: 1

module.exports = Booking
