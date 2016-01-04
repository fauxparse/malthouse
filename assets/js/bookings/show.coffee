class window.Venue extends Spine.Model
  @configure "Venue", "name", "address", "phone", "geo", "capacity"

  capacity: (capacity) ->
    @_capacity = parseInt(capacity, 10) if capacity?
    @_capacity

class window.Show extends Spine.Model
  @configure "Show", "title", "byline", "dates", "venue", "price", "note"

  title: (title) ->
    @_title = title if title?
    @_title

  byline: (byline) ->
    @_byline = byline if byline?
    @_byline

  dates: (dates) ->
    if dates?
      @_parsedDates = undefined
      @_dates = $.extend {}, dates
    @_dates || {}

  parsedDates: ->
    unless @_parsedDates?
      @_parsedDates = []
      for own date, open of @dates()
        @_parsedDates.push new Date(Date.parseDB(date))
      @_parsedDates.sort (a, b) ->
        a = a.getTime()
        b = b.getTime()
        if a < b then -1 else if a > b then 1 else 0
    @_parsedDates

  visible: ->
    Math.max(@parsedDates()...) > +(new Date)

  price: (price) ->
    @_price = parseInt(price, 10) if price?
    @_price

  venue: (venue) ->
    # @_venue_id = venue.id or venue if venue?
    # Venue.find @_venue_id
    if arguments.length
      venue = new Venue unless venue instanceof Venue
      @_venue = venue
    @_venue

  @fetch: ->
    $.getJSON("/shows").done (data, textStatus, xhr) =>
      Venue.refresh data.venues
      Show.refresh data.shows
