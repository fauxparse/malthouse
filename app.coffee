express = require "express"
app = express()

Show    = require "./lib/models/show"
Venue   = require "./lib/models/venue"
Booking = require "./lib/models/booking"
Mailer  = require "./lib/models/mailer"
sleep   = require "sleep"

PORT = process.env.PORT || 5000

app.configure ->
  app.set    "views",   "#{__dirname}/Build"
  app.engine "html",    require("ejs").renderFile
  app.use    "/assets", express.static("#{__dirname}/Build/assets")
  app.use    "/",       express.static("#{__dirname}/Build")
  app.use    express.bodyParser()

app.get "/", (request, response) ->
  response.render "index.html"
  
app.get "/shows", (request, response) ->
  response.contentType "application/json;charset=utf-8"
  response.send JSON.stringify(shows: Show.all(), venues: Venue.all())
  
app.get "/bookings", (request, response) ->
  if /^application\/json/.test request.headers.accept
    response.contentType "application/json;charset=utf-8"
    response.send JSON.stringify(shows: Show.all())
  else
    response.render "bookings.html"
  
app.post "/bookings", (request, response) ->
  attributes = request.body
  Booking.create attributes, (error, booking) ->
    console.log error if error
    Mailer.sendBookingConfirmation booking
    sleep.sleep 1
    response.contentType "application/json;charset=utf-8"
    response.send JSON.stringify(booking.toJSON())
    
app.get "/bookings/:show", (request, response) ->
  if /^application\/json/.test request.headers.accept
    response.contentType "application/json;charset=utf-8"
    Booking.forShow request.params.show, (error, bookings) ->
      response.send JSON.stringify(show: Show.find(request.params.show), bookings: bookings, venues: Show.DATA.venues)
  else
    response.render "bookings/show.html"
    
app.put "/bookings/:id", (request, response) ->
  response.contentType "application/json;charset=utf-8"
  Booking.findOne { id: request.params.id }, (error, booking) =>
    console.log error if error
    booking.update request.body, (error, booking) =>
      console.log error if error
      response.send JSON.stringify(booking.toJSON())
  
app.listen PORT, ->
  console.log "Listening on #{PORT}"
