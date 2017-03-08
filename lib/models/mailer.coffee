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
    @sendgrid or= SendGrid(process.env.SENDGRID_API_KEY)

  @send: (options) ->
    options = _.merge {}, @DEFAULTS, options
    helper = SendGrid.mail
    from_email = new helper.Email(options.from)
    to_email = new helper.Email(options.to)
    subject = options.subject
    content = new helper.Content('text/html', options.html)
    mail = new helper.Mail(from_email, subject, to_email, content)
    console.log mail
    request = @mailer().emptyRequest(method: 'POST', path: '/v3/mail/send', body: mail.toJSON())
    @mailer().API request, (error, response) =>
      console.log(response.statusCode)
      console.log(response.body)
      console.log(response.headers)

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
