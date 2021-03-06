String::ucfirst = ->
  @substr(0, 1).toUpperCase() + @substr(1)

Number::pad = (n = 2) ->
  str = @toString()
  str = "0" + str while str.length < 2
  str
  
Number::dollars = ->
  cents = this % 100
  cents = if cents is 0
    ""
  else if cents < 10
    ".0#{cents}"
  else
    ".#{cents}"
  "$#{Math.floor(this / 100)}#{cents}"
  
Date.MONTHS = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ]
Date.DAYS = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ]

Date::db = ->
  "#{@getFullYear()}-#{(@getMonth() + 1).pad()}-#{@getDate().pad()} #{@getHours().pad()}:#{@getMinutes().pad()}"
  
Date.parseDB = (date) ->
  return date unless typeof date is "string"
  parts = (parseInt p, 10 for p in date.split(/[^\d]+/))
  new Date parts[0], parts[1] - 1, parts[2], parts[3], parts[4]

Date::label = ->
  "#{@date()}, #{@time()}"

Date::date = ->
  "#{Date.DAYS[@getDay()]}, #{@getDate()} #{Date.MONTHS[@getMonth()]}"

Date::time = ->
  "#{((@getHours() - 1) % 12 + 1)}:#{@getMinutes().pad()}#{if @getHours() < 12 then "am" else "pm"}"

if Spine?  
  Spine.Controller::after = (timeout, callback) ->
    setTimeout callback, timeout

  Spine.Controller::immediately = (callback) ->
    @after 0, callback

  Spine.Controller::every = (interval, callback) ->
    setInterval callback, interval
