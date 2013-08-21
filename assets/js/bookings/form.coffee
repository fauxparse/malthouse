class window.BookingForm extends Spine.Controller
  @template: "
    <div class=\"modal-dialog\">
      <div class=\"modal-content\">
        <div class=\"modal-header\">
          <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>
          <h4 class=\"modal-title\">Book tickets online</h4>
        </div>
        <div class=\"modal-body\">
          <form class=\"form-horizontal\">
            <div class=\"form-group\" rel=\"shows\">
              <label class=\"col-sm-4 control-label\">Choose a show</label>
              <input type=\"hidden\" name=\"show_id\" value=\"\">
              <div class=\"col-sm-8\">
                <div class=\"btn-group btn-block\">
                  <button type=\"button\" class=\"btn btn-default dropdown-toggle btn-block btn-info\" data-toggle=\"dropdown\">
                    <span class=\"current\">{{show}}</span> <span class=\"caret\"></span>
                  </button>
                  <ul class=\"dropdown-menu\">
                    {{#shows}}
                      <li><a href=\"#\" data-value=\"{{id}}\">{{title}}</a></li>
                    {{/shows}}
                  </ul>
                </div>
              </div>
            </div>
            <div class=\"form-group\" rel=\"performances\">
              <label class=\"col-sm-4 control-label\">Choose a performance</label>
              <input type=\"hidden\" name=\"date\" value=\"\">
              <div class=\"col-sm-8\">
                <div class=\"btn-group btn-block\">
                  <button type=\"button\" class=\"btn btn-default dropdown-toggle btn-block btn-info\" data-toggle=\"dropdown\">
                    <span class=\"current\">{{date}}</span> <span class=\"caret\"></span>
                  </button>
                  <ul class=\"dropdown-menu\">
                    {{#dates}}
                      <li><a href=\"#\" data-value=\"{{date}}\">{{label}}</a></li>
                    {{/dates}}
                  </ul>
                </div>
              </div>
            </div>
            <div class=\"form-group\">
              <label class=\"col-sm-4 control-label\">Number of tickets</label>
              <div class=\"col-sm-3\">
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
              <div class=\"col-sm-5 ticket-pricing\">
                &times; <span class=\"ticket-price\">$7</span> = <span class=\"total-price\">$14</span>
              </div>
            </div>
            <div class=\"form-group\">
              <label class=\"col-sm-4 control-label\">Your name</label>
              <div class=\"col-sm-8\">
                <input type=\"text\" name=\"name\" class=\"form-control\">
              </div>
            </div>
            <div class=\"form-group\">
              <label class=\"col-sm-4 control-label\">Your email</label>
              <div class=\"col-sm-8\">
                <input type=\"email\" name=\"email\" class=\"form-control\">
              </div>
            </div>
            <div class=\"form-group\">
              <label class=\"col-sm-4 control-label\">Your phone number</label>
              <div class=\"col-sm-8\">
                <input type=\"phone\" name=\"phone\" class=\"form-control\">
              </div>
            </div>
            <div class=\"form-group\">
              <label class=\"col-sm-4 control-label\">Payment method</label>
              <div class=\"col-sm-8\">
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
          <div class=\"loading-overlay\" style=\"display: none;\"><h4>Processing booking…</h4></div>
        </div>
        <div class=\"modal-footer\">
          <button type=\"button\" class=\"btn btn-default\" rel=\"cancel\" data-dismiss=\"modal\">Cancel</button>
          <button type=\"button\" class=\"btn btn-success\" rel=\"submit\">Submit booking</button>
        </div>
      </div>
    </div>
    "
    
  @successTemplate: "
    <h3>Thanks for booking!</h3>
    <p>Your booking number is <strong>{{id}}</strong>.</p>
    {{#internetBanking}}
    <p>Please use this number as a reference when making your payment of <strong>{{total}}</strong>. Our account details are:</p>
    <blockquote>
      <p>
        Canterbury Children’s Theatre Inc<br>
        XX-XXXX-XXXXXXX-XXX
      <p>
    </blockquote>
    {{/internetBanking}}
    {{^internetBanking}}
    <p>Please bring <strong>{{total}}</strong> cash (or a cheque made out to Canterbury Children’s Theatre, Inc) to the performance with you. <strong>Sorry, we are unable to accept EFT-POS or credit cards at the theatre.</strong></p>
    {{/internetBanking}}
    {{#email}}
    <p>We’ve emailed you a copy of this booking for your records, but you don’t need to bring it with you on the day.</p>
    {{/email}}
    <p>We’ll see you on <strong>{{date}}</strong>! The show starts at <strong>{{time}}</strong>, but please arrive around 15–20 minutes early.</p>
    "
    
  elements:
    "form" : "form"
    ".modal-content" : "dialog"
    "[rel=shows] .current" : "currentShow"
    "[rel=shows] .dropdown-menu" : "showMenu"
    "[rel=performances] .current" : "currentPerformance"
    "[rel=performances] .dropdown-menu" : "performanceMenu"
    "[name=tickets]" : "numberOfTickets"
    ".loading-overlay" : "overlay"
    
  events:
    "mousedown [rel=minus], [rel=plus]" : "startCount"
    "tick [rel=minus]" : "minus"
    "tick [rel=plus]" : "plus"
    "click .dropdown-menu [data-value]" : "dropdownChanged"
    "change [name=show_id]" : "updateDates"
    "click [rel=submit]" : "submit"
    "submit form" : "submit"
    "keypress :input" : "keypress"
    
  @url: "/bookings"
  
  init: ->
    @el
      .addClass("booking modal fade")
      .on("shown.bs.modal", @shown)
      .on("hidden.bs.modal", @hidden)
    @append $("<div>", "class": "modal-content")
    @dialog.wrap "<div class=\"modal-dialog\">"
    @render()
    Booking
      .bind("ajaxSuccess", @success)
      .bind("ajaxError",   @error)
    
  shown: =>
    @$("[name=name]").focus()
    
  hidden: =>
    @immediately @release
  
  render: ->
    show = @booking.show()
    dates = ({ date: date.db(), label: date.label() } for date in show.dates())
    @html Milk.render @constructor.template,
      show:    show.title()
      shows:   ({ id: show.id, title: show.title() } for show in Show.all())
      date:    dates[0].label
      dates:   dates
    @$("[name=show_id]").val show.id
    @$("[name=date]").val dates[0].date
    
  show: =>
    @el.modal "show"
    
  hide: =>
    @el.modal "hide"
    
  changeNumberOfTickets: (e, inc = 1) ->
    input = $(e.target).closest(".input-group").find("input")
    v = parseInt input.val(), 10
    v = 1 if isNaN v
    input.val(Math.max(v + inc, 1)).trigger("change")
    @updatePrices()
    
  startCount: (e) ->
    e.preventDefault()
    button = $(e.target).trigger("tick")
    initial = @after 500, =>
      ticker = @every 100, =>
        button.trigger "tick"
      $(window).one "mouseup", -> clearInterval ticker
    $(window).one "mouseup", -> clearTimeout initial
    
  minus: (e) ->
    @changeNumberOfTickets e, -1
    
  plus: (e) ->
    @changeNumberOfTickets e, 1
    
  dropdownChanged: (e) ->
    e.preventDefault()
    target = $(e.target).closest("a")
    input = target.closest(".form-group").find("input")
    newValue = target.attr("data-value")
    oldValue = input.val()
    
    unless newValue is oldValue
      target.closest(".form-group")
        .find(".current")
        .html(target.html())
      input.val(newValue).trigger("change")

  updateDates: (e) ->
    @booking.show_id = @$("[name=show_id]").val()
    dates = @booking.show().dates()
    @currentPerformance.html dates[0].label()
    @performanceMenu.empty()
    for date in dates
      $("<a href=\"#\">")
        .html(date.label())
        .attr("data-value", date.db())
        .appendTo(@performanceMenu)
        .wrap("<li>")
        
  updatePrices: ->
    n = parseInt @numberOfTickets.val(), 10
    n = 1 if isNaN n
    @$(".ticket-price").text @booking.show().price().dollars()
    @$(".total-price").text (n * @booking.show().price()).dollars()
    
  submit: ->
    booking = Booking.fromForm @form
    @$(".alert-danger").remove()
    @$(".has-error")
      .removeClass("has-error")
      .find(".help-block").remove().end()
    if errors = booking.validate()
      for own key, message of errors
        @$("[name=#{key}]").closest(".form-group")
          .addClass("has-error")
          .find("label").next("div")
          .append($("<div class=\"help-block\">").html(message))
        @$(".has-errors input").first().focus()
    else
      @overlay.fadeIn()
      booking.save()
      
  success: (booking) =>
    @form.replaceWith @bookingSuccessMessage(booking)
    @$(".modal-footer [rel=submit]").remove()
    @$(".modal-footer [rel=cancel]").html("OK")
    @overlay.fadeOut()
    
  bookingSuccessMessage: (booking) ->
    data = $.extend {}, booking.toJSON(),
      internetBanking: booking.payment() is "internet"
      total: booking.total().dollars(),
      date: booking.date().date()
      time: booking.date().time()
    Milk.render @constructor.successTemplate, data
    
  error: (record, xhr, settings, error) =>
    @overlay.fadeOut()
    $("<div>")
      .addClass("alert alert-danger")
      .html("<strong>Sorry!</strong> There was a problem processing your booking. Please check your details and try again, or call us now on <strong>0800 BOOKINGS</strong>")
      .prependTo(@form)

  keypress: (e) ->
    @submit() if e.which is 13
