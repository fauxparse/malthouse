Spine = require("spine")

class Show extends Spine.Model
  @configure "Show", "title", "byline", "dates", "venue", "price"

Show.refresh require("../../shows.json").shows
  
module.exports = Show
