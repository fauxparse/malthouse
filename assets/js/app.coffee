$ ->
  Show.fetch().done ->
    $("body").on "click", "a[rel=book]", (e) ->
      e.preventDefault()
      booking = new Booking show_id: $(e.target).attr("data-show")
      form = new BookingForm booking: booking
      form.show()

  topNav = $("#home .navigation").clone()
    .addClass("top-navigation")
    .appendTo("body")
    .find("nav").attr("id", "top-navigation").end()
    .hide()
  navPosition = $("#home .navigation").offset().top

  $(window).on "scroll", ->
    h = $(this).height() / 2
    scrollTop = $(this).scrollTop()
    o = Math.max((h - scrollTop) / h, 0)
    $(".costumes-website").toggle(o > 0).css opacity: o
    topNav.toggle(scrollTop >= navPosition)
  .on "resize", ->
    y = $("#home .navigation").offset().top
    $(this).trigger "scroll"
    
    years = $("#shows .timeline .year")
    m = ($("#shows").outerWidth() - $("#shows .container").width()) / 2
    $("#shows .timeline-inner")
      .width(years.length * years.first().outerWidth())
      .css("margin", "0 #{m}px")
  .trigger "resize"
  
  $("nav a, a[rel=top]")
    .smoothScroll()
    
  $("body").scrollspy
    target: "#top-navigation"
    offset: 150
  
  google.maps.visualRefresh = true
  position = new google.maps.LatLng(-43.56097359999957, 172.6365446378158)
  map = new google.maps.Map $("#contact .map .canvas")[0],
    mapTypeId: google.maps.MapTypeId.ROADMAP
    center:    position
    zoom:      15
    styles: [
      {
        featureType: "water"
        elementType: "geometry.fill"
        stylers:     [ { color: "#00aeef" } ]
      },
      {
        featureType: "road"
        elementType: "geometry.stroke"
        stylers:     [ { visibility: "off" } ]
      },
      {
        featureType: "administrative.land_parcel"
        stylers:     [ { visibility: "off" } ]
      },
      {
        featureType: "poi"
        elementType: "geometry.fill"
        stylers:     [ { color: "#8dc63f" } ]
      },
      {
        featureType: "poi"
        elementType: "geometry.stroke"
        stylers:     [ { visibility: "off" } ]
      }
    ]
  icon =
    url:        "/assets/img/#{if window.devicePixelRatio > 1 then "marker@2x" else "marker"}.png"
    scaledSize: new google.maps.Size(30, 42)
    origin:     new google.maps.Point(0,0)
    anchor:     new google.maps.Point(15, 21)
  marker = new google.maps.Marker
    position:  position
    map:       map
    animation: google.maps.Animation.DROP
    icon:      icon
