Spine = require "spine"
Booking = require "./booking"
Venue = require "./venue"

class Show extends Spine.Model
  @DATA = require "../../shows.json"
  @configure "Show", "title", "byline", "dates", "venue", "price"

  venue: (id) ->
    if id?
      @_venue_id = id
      @_venue = undefined
    @_venue or= Venue.find @_venue_id

  @bookings = (callback) ->
    Booking.collection().mapReduce(
      "function () { emit([this.show_id, this.date], this.tickets); }"
      "function (key, values) { return Array.sum(values); }"
      { out: { inline: 1 } }
      (error, collection, stats) ->
        unless error
          shows = {}
          Show.each (show) -> shows[show.id] = show
          for row in collection
            [id, date] = row._id
            shows[id].dates[date] and= row.value < shows[id].venue().capacity
          shows = (shows[key] for key in Object.keys(shows))
          callback null, shows
        else
          callback error, collection
    )

Venue.refresh Show.DATA.venues
Show.refresh Show.DATA.shows
Booking.Show = Show

module.exports = Show
