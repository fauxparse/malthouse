class BookingsController extends Spine.Controller
  @SECTION = "
    <section class=\"performance\">
      <a href=\"#bookings-{{id}}\" data-toggle=\"collapse\"><span class=\"glyphicon glyphicon-play\"></span></a>
      <header>
        <div class=\"row\">
          <div class=\"col-xs-12\"><h2></h2></div>
        </div>
        <div class=\"row\">
          <div class=\"col-xs-9\">
            <div class=\"progress\">
              <div class=\"progress-bar progress-bar-danger\" style=\"width: 0%;\" rel=\"unpaid\"></div>
              <div class=\"progress-bar progress-bar-success\" style=\"width: 0%;\" rel=\"paid\"></div>
            </div>
          </div>
          <div class=\"stat col-xs-1\" rel=\"unpaid\"></div>
          <div class=\"stat col-xs-1\" rel=\"paid\"></div>
          <div class=\"stat col-xs-1\" rel=\"total\"></div>
        </div>
      </header>
      <div class=\"collapse bookings\" id=\"bookings-{{id}}\">
      </div>
    </section>
  "
  
  @BOOKING = "
    <div class=\"row booking\" data-reference=\"{{id}\">
      <div class=\"col-xs-3\">
        <div class=\"reference\">{{id}}</div>
        <div class=\"name\">{{name}}</div>
      </div>
      <div class=\"col-xs-3\">
        {{#email}}<a class=\"email\" href=\"mailto:{{email}}\">{{email}}</a>{{/email}}
        <div class=\"phone\">{{phone}}</div>
      </div>
      <div class=\"col-xs-1\">
        <div class=\"payment\">{{payment}}</div>
        <div class=\"amount\">{{amount}}</div>
      </div>
      <div class=\"col-xs-2\"><button class=\"btn btn-default btn-block\">Unpaid</button></div>
      <div class=\"stat col-xs-1\" rel=\"unpaid\">{{unpaid}}</div>
      <div class=\"stat col-xs-1\" rel=\"paid\">{{paid}}</div>
      <div class=\"stat col-xs-1\" rel=\"total\">{{total}}</div>
    </div>
  "
  
  events:
    "show.bs.collapse .bookings" : "open"
    "hide.bs.collapse .bookings" : "collapse"
    "click .booking .btn" : "togglePayment"
  
  init: ->
    Show.bind "refresh", @render
    Booking
      .bind("refresh", @renderBookings)
      .bind("update",  @update)
    
    $.getJSON(window.location.pathname).done (data) ->
      Venue.refresh data.venues
      Show.refresh data.show
      Booking.refresh data.bookings
  
  render: (show) =>
    @show = show.shift?() or show
    $("h1").html "Bookings for <strong>#{@show.title()}</strong>"
    for date in @show.dates()
      id = date.db().replace(/[^\d]+/g, "-")
      section = $(Milk.render @constructor.SECTION, id: id).appendTo(@el)
        .attr("data-date", date.db())
        .find("h2").text(date.label()).end()
    
  renderBookings: (bookings) =>
    @updateHeader @$(".total"), bookings, @show.dates().length * @show.venue().capacity()
    for own key, list of Booking.partition()
      section = $("section[data-date='#{key}']")
      @updateHeader section, list, @show.venue().capacity()
      section.find(".bookings").append @renderBooking(booking) for booking in list
      
  renderBooking: (booking) =>
    data = $.extend {}, booking.toJSON(),
      payment: booking.payment().ucfirst()
      unpaid:  if booking.paid() then "" else booking.tickets()
      paid:    if booking.paid() then booking.tickets() else ""
      total:   booking.tickets()
      amount:  booking.amount().dollars()
    row = $ Milk.render(@constructor.BOOKING, data)
    row.attr "data-reference", booking.id
    if booking.paid()
      row
        .addClass("paid")
        .find(".btn").addClass("btn-success").text("Paid").end()
    row
    
  update: (booking) =>
    @$("[data-reference='#{booking.id}']")
      .replaceWith(@renderBooking(booking))
    @updateHeader @$("[data-date='#{booking.date().db()}']"),
      (b for b in Booking.all() when b.date().getTime() is booking.date().getTime()),
      @show.venue().capacity()
    @updateHeader @$(".total"), Booking.all(), @show.dates().length * @show.venue().capacity()
    
  updateHeader: (section, bookings, max) =>
    stats =
      unpaid: 0
      paid:   0
      total:  0
    for booking in bookings
      stats.unpaid += +!booking.paid() * booking.tickets()
      stats.paid   +=  +booking.paid() * booking.tickets()
      stats.total  += booking.tickets()
    for own key, value of stats
      $("header .stat[rel=#{key}]", section).html value or "&nbsp;"
      $("header .progress-bar[rel=#{key}]", section).animate(width: "#{value * 100.0 / max}%")
      
  open: (e) ->
    $(e.target).closest(".performance").addClass "open"

  collapse: (e) ->
    $(e.target).closest(".performance").removeClass "open"

  bookingFromElement: (el) ->
    Booking.exists $(el).closest(".booking").attr("data-reference")
    
  togglePayment: (e) ->
    if booking = @bookingFromElement(e.target)
      booking.updateAttributes { paid: !booking.paid() }

$ ->
  new BookingsController el: ".container"
