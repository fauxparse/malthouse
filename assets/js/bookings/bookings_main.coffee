$ ->
  Booking.fetchSummary().done (data) ->
    Show.each (show) ->
      $("<a>", href: "/bookings/#{show.id}")
        .html(show.title())
        .appendTo("ul")
        .wrap("<li>")
        