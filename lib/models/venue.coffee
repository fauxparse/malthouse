Spine = require "spine"

Show = require "./show"

class Venue extends Spine.Model
  @configure "Venue", "name", "address", "phone", "geo", "capacity"
  
Venue.refresh Show.DATA.venues

module.exports = Venue
