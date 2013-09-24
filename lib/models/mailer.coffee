_  = require "lodash"
mu = require "mu2"

require "../../assets/js/bookings/util"

mu.root = "#{__dirname}/../../templates"

SendGrid = require "sendgrid"

class Mailer
  @DEFAULTS:
    from:     "malthouse.bookings@gmail.com"
    fromname: "Canterbury Children’s Theatre"
    to:       "malthouse.bookings@gmail.com"
  
  @mailer: ->
    @sendgrid or= new SendGrid(
      process.env.SENDGRID_USERNAME,
      process.env.SENDGRID_PASSWORD
    )
    
  @send: (options) ->
    options = _.merge {}, @DEFAULTS, options
    @mailer().send options

  @render: (template, data, callback) ->
    body = ""
    mu.compileAndRender(template, data)
      .on "data", (chunk) ->
        body += chunk.toString()
      .on "end", ->
        callback false, body
  
  @sendBookingConfirmation: (booking) ->
    show = booking.show()
    date = new Date(booking.date)
    data =
      name:            booking.name
      phone:           booking.phone
      email:           booking.email
      booking:         booking.id
      comments:        booking.comments
      show:            show.title
      date:            date.date()
      time:            date.time()
      tickets:         booking.tickets
      perTicket:       show.price.dollars()
      total:           booking.amount.dollars()
      internetBanking: booking.payment is "internet"
    @render "notification.html", data, (error, html) =>
      @send
        subject:  "Booking ##{booking.id} for #{show.title}"
        from:     booking.email or @DEFAULTS.from
        fromname: booking.name
        html:     html
    if booking.email?
      @render "confirmation.html", data, (error, html) =>
        @send
          to:      booking.email
          subject: "Your booking ##{booking.id} for #{show.title}"
          html:    html

module.exports = Mailer