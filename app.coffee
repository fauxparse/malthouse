express = require "express"
app = express()
current_shows = require "./shows.json"

PORT = process.env.PORT || 5000

app.configure ->
  app.set    "views",   "#{__dirname}/Build"
  app.engine "html",    require("ejs").renderFile
  app.use    "/assets", express.static("#{__dirname}/Build/assets")
  app.use    "/",       express.static("#{__dirname}/Build")

app.get "/", (request, response) ->
  response.render "index.html"
  
app.get "/shows.json", (request, response) ->
  response.contentType "application/json; charset=utf8"
  response.send JSON.stringify(current_shows)

app.listen PORT, ->
  console.log "Listening on #{PORT}"
