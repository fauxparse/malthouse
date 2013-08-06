Number::pad = (n = 2) ->
  str = @toString()
  str = "0" + str while str.length < 2
  str
  
Date.MONTHS = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ]
Date.DAYS = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ]

Date::db = ->
  "#{@getFullYear()}-#{(@getMonth() + 1).pad()}-#{@getDate().pad()} #{@getHours().pad()}:#{@getMinutes().pad()}"

Date::label = ->
  
  "#{Date.DAYS[@getDay()]}, #{@getDate()} #{Date.MONTHS[@getMonth()]}, #{((@getHours() - 1) % 12 + 1)}:#{@getMinutes().pad()}#{if @getHours() < 12 then "am" else "pm"}"

class window.Show extends Spine.Model
  @configure "Show", "title", "byline", "dates", "venue"
  
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
    
  @fetch: ->
    $.getJSON("/shows.json")
      .done (data) =>
        Venue.refresh data.venues
        Show.refresh data.shows
    
class window.Venue extends Spine.Model
  @configure "Venue", "name", "address", "phone", "geo"

class window.Booking extends Spine.Model
  @configure "Booking", "show_id", "date", "tickets", "name", "email", "phone", "payment"
  
  show: ->
    Show.find @showId

class window.BookingForm extends Spine.Controller
  elements:
    ".modal-content" : "dialog"
    
  events:
    "hidden" : "release"
    "click [rel=minus]" : "minus"
    "click [rel=plus]" : "plus"
    
  @template: "
    <div class=\"modal-dialog\">
      <div class=\"modal-content\">
        <div class=\"modal-header\">
          <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>
          <h4 class=\"modal-title\">Book tickets online</h4>
        </div>
        <div class=\"modal-body\">
          <form class=\"form-horizontal\">
            <div class=\"form-group\">
              <label class=\"col-lg-4 control-label\">Choose a show</label>
              <input type=\"hidden\" name=\"show_id\" value=\"\">
              <div class=\"col-lg-8\">
                <div class=\"btn-group btn-block\">
                  <button type=\"button\" class=\"btn btn-default dropdown-toggle btn-block btn-info\" data-toggle=\"dropdown\">
                    {{show}} <span class=\"caret\"></span>
                  </button>
                  <ul class=\"dropdown-menu\">
                    {{#shows}}
                      <li><a href=\"#\" data-show=\"{{id}}\">{{title}}</a></li>
                    {{/shows}}
                  </ul>
                </div>
              </div>
            </div>
            <div class=\"form-group\">
              <label class=\"col-lg-4 control-label\">Choose a performance</label>
              <input type=\"hidden\" name=\"date\" value=\"\">
              <div class=\"col-lg-8\">
                <div class=\"btn-group btn-block\">
                  <button type=\"button\" class=\"btn btn-default dropdown-toggle btn-block btn-info\" data-toggle=\"dropdown\">
                    {{date}} <span class=\"caret\"></span>
                  </button>
                  <ul class=\"dropdown-menu\">
                    {{#dates}}
                      <li><a href=\"#\" data-date=\"{{date}}\">{{label}}</a></li>
                    {{/dates}}
                  </ul>
                </div>
              </div>
            </div>
            <div class=\"form-group\">
              <label class=\"col-lg-4 control-label\">Number of tickets</label>
              <div class=\"col-lg-3\">
                <div class=\"input-group\">
                  <span class=\"input-group-btn\">
                    <button class=\"btn btn-default\" type=\"button\" rel=\"minus\">-</button>
                  </span>
                  <input type=\"text\" class=\"form-control\" name=\"tickets\" value=\"2\">
                  <span class=\"input-group-btn\">
                    <button class=\"btn btn-default\" type=\"button\" rel=\"plus\">+</button>
                  </span>
                </div>
              </div>
            </div>
            <div class=\"form-group\">
              <label class=\"col-lg-4 control-label\">Your name</label>
              <div class=\"col-lg-8\">
                <input type=\"text\" name=\"name\" class=\"form-control\">
              </div>
            </div>
            <div class=\"form-group\">
              <label class=\"col-lg-4 control-label\">Your email</label>
              <div class=\"col-lg-8\">
                <input type=\"email\" name=\"email\" class=\"form-control\">
              </div>
            </div>
            <div class=\"form-group\">
              <label class=\"col-lg-4 control-label\">Your phone number</label>
              <div class=\"col-lg-8\">
                <input type=\"phone\" name=\"phone\" class=\"form-control\">
              </div>
            </div>
            <div class=\"form-group\">
              <label class=\"col-lg-4 control-label\">Payment method</label>
              <div class=\"col-lg-8\">
                <div class=\"radio\">
                  <label>
                    <input type=\"radio\" name=\"payment\" value=\"internet\" checked>
                    Internet banking
                  </label>
                </div>
                <div class=\"radio\">
                  <label>
                    <input type=\"radio\" name=\"payment\" value=\"cash\">
                    Cash on the door (sorry, no EFT-POS!)
                  </label>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class=\"modal-footer\">
          <button type=\"button\" class=\"btn btn-default pull-left\">More information</button>
          <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Cancel</button>
          <button type=\"button\" class=\"btn btn-success\">Submit booking</button>
        </div>
      </div>
    </div>
    "
  
  init: ->
    @el.addClass "booking modal fade"
    @append $("<div>", "class": "modal-content")
    @dialog.wrap "<div class=\"modal-dialog\">"
    @render()
  
  render: ->
    show = @booking.show()
    dates = ({ date: date.db(), label: date.label() } for date in show.dates())
    @html Milk.render @constructor.template,
      show: show.title()
      shows: ({ id: show.id, title: show.title() } for show in Show.all())
      date: dates[0].label
      dates: dates
    
  show: =>
    @el.modal "show"
    
  hide: =>
    @el.modal "hide"
    
  changeNumberOfTickets: (e, inc = 1) ->
    input = $(e.target).closest(".input-group").find("input")
    v = parseInt input.val(), 10
    v = 1 if isNaN v
    input.val Math.max(v + inc, 1)
    
  minus: (e) ->
    @changeNumberOfTickets e, -1
    
  plus: (e) ->
    @changeNumberOfTickets e, 1

$ ->
  Show.fetch().done ->
    $("body").on "click", "a[rel=book]", (e) ->
      e.preventDefault()
      booking = new Booking showId: $(e.target).attr("data-show")
      form = new BookingForm booking: booking
      form.show()