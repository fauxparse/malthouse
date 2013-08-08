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
    m = ($("#shows").outerWidth() - $("#shows .container").outerWidth()) / 2
    $("#shows .timeline-inner")
      .width(years.length * years.first().outerWidth())
      .css("margin", "0 #{m}px")
  .trigger "resize"
  
  $("nav a")
    .smoothScroll()
