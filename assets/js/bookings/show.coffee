class window.Venue extends Spine.Model
  @configure "Venue", "name", "address", "phone", "geo"

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
      @_dates = (new Date(Date.parse(date)) for date in dates)
    (@_dates || []).slice 0
    
  price: (price) ->
    @_price = parseInt(price, 10) if price?
    @_price
    
  @fetch: ->
    $.getJSON("/shows.json")
      .done (data) =>
        # Venue.refresh data.venues
        Show.refresh data.shows
