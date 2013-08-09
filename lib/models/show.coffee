Spine = require "spine"

class Show extends Spine.Model
  @DATA = require "../../shows.json"
  @configure "Show", "title", "byline", "dates", "venue", "price"
  
Show.refresh Show.DATA.shows

module.exports = Show
