class window.Venue extends Spine.Model
  @configure "Venue", "name", "address", "phone", "geo", "capacity"

  capacity: (capacity) ->
    @_capacity = parseInt(capacity, 10) if capacity?
    @_capacity
    
class window.Show extends Spine.Model
  @configure "Show", "title", "byline", "dates", "venue", "price"
  
  title: (title) ->
    @_title = title if title?
    @_title
    
  byline: (byline) ->
    @_byline = byline if byline?
    @_byline
    
  dates: (dates) ->
    if dates?
      @_dates = (new Date(Date.parseDB(date)) for date in dates)
    (@_dates || []).slice 0
    
  price: (price) ->
    @_price = parseInt(price, 10) if price?
    @_price
    
  venue: (venue) ->
    @_venue_id = venue.id or venue if venue?
    Venue.find @_venue_id

  @fetch: ->
    $.getJSON("/shows")
      .done (data) =>
        Venue.refresh data.venues
        Show.refresh data.shows
