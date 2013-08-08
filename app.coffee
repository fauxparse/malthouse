express = require "express"
app = express()

Show = require "./lib/models/show"
Booking = require "./lib/models/booking"
sleep = require "sleep"

PORT = process.env.PORT || 5000

app.configure ->
  app.set    "views",   "#{__dirname}/Build"
  app.engine "html",    require("ejs").renderFile
  app.use    "/assets", express.static("#{__dirname}/Build/assets")
  app.use    "/",       express.static("#{__dirname}/Build")
  app.use    express.bodyParser()

app.get "/", (request, response) ->
  response.render "index.html"
  
app.get "/shows.json", (request, response) ->
  response.contentType "application/json; charset=utf8"
  response.send JSON.stringify(shows: Show.all())
  
app.post "/bookings", (request, response) ->
  attributes = request.body
  Booking.create attributes, (error, booking) ->
    sleep.sleep 1
    response.contentType "application/json; charset=utf8"
    response.send JSON.stringify(booking.toJSON())
    
app.get "/bookings/:show", (request, response) ->
  if /^application\/json/.test request.headers.accept
    response.contentType "application/json; charset=utf8"
  else
    response.render "bookings_for_show.html"
  
app.listen PORT, ->
  console.log "Listening on #{PORT}"
