class window.Booking extends Spine.Model
  @configure "Booking", "show_id", "date", "tickets", "name", "email", "phone", "payment", "paid", "amount"
  @extend Spine.Model.Ajax
  
  @EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ # meh, close enough
  
  show_id: (show_id) ->
    @_show_id = show_id if show_id?
    @_show_id

  name: (name) ->
    @_name = name if name?
    @_name

  email: (email) ->
    @_email = email if email?
    @_email
  
  phone: (phone) ->
    @_phone = phone if phone?
    @_phone

  payment: (payment) ->
    @_payment = payment if payment?
    @_payment
  
  paid: (paid) ->
    @_paid = !!paid if paid?
    @_paid
  
  date: (date) ->
    @_date = new Date Date.parseDB(date) if date?
    @_date

  tickets: (tickets) ->
    @_tickets = parseInt tickets, 10 if tickets?
    @_tickets
    
  amount: (amount) ->
    @_amount = parseInt amount, 10 if amount?
    @_amount
    
  show: ->
    Show.find @show_id()
    
  validate: ->
    errors = {}
    errors.show_id = "Please select a show" unless @show_id()
    errors.date = "Please select a performance" unless @date()
    errors.name = "Please fill in your name" unless @name()
    errors.email = "Please fill in your email address or phone number" unless @email() or @phone()
    errors.email = "Please check your email address" if @email() and !@email().match(@constructor.EMAIL)
    errors.tickets = "Please select a number of tickets" if isNaN(@tickets()) or (@tickets() < 1)
    return errors for own key of errors
    
  total: (total) ->
    @_total = total if total?
    @_total ? (@show().price() * @tickets())
    
  toJSON: ->
    json = super
    $.extend {}, json,
      date: @date()?.db()

  @fetchSummary: ->
    promise = $.Deferred()
    $.getJSON("/bookings").done (data) ->
      Show.refresh data.shows
      promise.resolve()
    promise
    
  @partition: ->
    @all().reduce(
      (hash, booking) ->
        (hash[booking.date().db()] ?= []).push(booking) && hash
      {}
    )
