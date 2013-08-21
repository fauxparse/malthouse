(function() {
  $(function() {
    return Booking.fetchSummary().done(function(data) {
      return Show.each(function(show) {
        return $("<a>", {
          href: "/bookings/" + show.id
        }).html(show.title()).appendTo("ul").wrap("<li>");
      });
    });
  });

}).call(this);
