Spine = require "spine"

Show = require "./show"

class Venue extends Spine.Model
  @configure "Venue", "name", "address", "phone", "geo", "capacity"
  
module.exports = Venue
