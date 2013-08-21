(function() {
  var BookingsController, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BookingsController = (function(_super) {
    __extends(BookingsController, _super);

    function BookingsController() {
      this.updateHeader = __bind(this.updateHeader, this);
      this.update = __bind(this.update, this);
      this.renderBooking = __bind(this.renderBooking, this);
      this.renderBookings = __bind(this.renderBookings, this);
      this.render = __bind(this.render, this);
      _ref = BookingsController.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    BookingsController.SECTION = "    <section class=\"performance\">      <a href=\"#bookings-{{id}}\" data-toggle=\"collapse\"><span class=\"glyphicon glyphicon-play\"></span></a>      <header>        <div class=\"row\">          <div class=\"col-xs-12\"><h2></h2></div>        </div>        <div class=\"row\">          <div class=\"col-xs-9\">            <div class=\"progress\">              <div class=\"progress-bar progress-bar-danger\" style=\"width: 0%;\" rel=\"unpaid\"></div>              <div class=\"progress-bar progress-bar-success\" style=\"width: 0%;\" rel=\"paid\"></div>            </div>          </div>          <div class=\"stat col-xs-1\" rel=\"unpaid\"></div>          <div class=\"stat col-xs-1\" rel=\"paid\"></div>          <div class=\"stat col-xs-1\" rel=\"total\"></div>        </div>      </header>      <div class=\"collapse bookings\" id=\"bookings-{{id}}\">      </div>    </section>  ";

    BookingsController.BOOKING = "    <div class=\"row booking\" data-reference=\"{{id}\">      <div class=\"col-xs-3\">        <div class=\"reference\">{{id}}</div>        <div class=\"name\">{{name}}</div>      </div>      <div class=\"col-xs-3\">        {{#email}}<a class=\"email\" href=\"mailto:{{email}}\">{{email}}</a>{{/email}}        <div class=\"phone\">{{phone}}</div>      </div>      <div class=\"col-xs-1\">        <div class=\"payment\">{{payment}}</div>        <div class=\"amount\">{{amount}}</div>      </div>      <div class=\"col-xs-2\"><button class=\"btn btn-default btn-block\">Unpaid</button></div>      <div class=\"stat col-xs-1\" rel=\"unpaid\">{{unpaid}}</div>      <div class=\"stat col-xs-1\" rel=\"paid\">{{paid}}</div>      <div class=\"stat col-xs-1\" rel=\"total\">{{total}}</div>    </div>  ";

    BookingsController.prototype.events = {
      "show.bs.collapse .bookings": "open",
      "hide.bs.collapse .bookings": "collapse",
      "click .booking .btn": "togglePayment"
    };

    BookingsController.prototype.init = function() {
      Show.bind("refresh", this.render);
      Booking.bind("refresh", this.renderBookings).bind("update", this.update);
      return $.getJSON(window.location.pathname).done(function(data) {
        Venue.refresh(data.venues);
        Show.refresh(data.show);
        return Booking.refresh(data.bookings);
      });
    };

    BookingsController.prototype.render = function(show) {
      var date, id, section, _i, _len, _ref1, _results;
      this.show = (typeof show.shift === "function" ? show.shift() : void 0) || show;
      $("h1").html("Bookings for <strong>" + (this.show.title()) + "</strong>");
      _ref1 = this.show.dates();
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        date = _ref1[_i];
        id = date.db().replace(/[^\d]+/g, "-");
        _results.push(section = $(Milk.render(this.constructor.SECTION, {
          id: id
        })).appendTo(this.el).attr("data-date", date.db()).find("h2").text(date.label()).end());
      }
      return _results;
    };

    BookingsController.prototype.renderBookings = function(bookings) {
      var booking, key, list, section, _ref1, _results;
      this.updateHeader(this.$(".total"), bookings, this.show.dates().length * this.show.venue().capacity());
      _ref1 = Booking.partition();
      _results = [];
      for (key in _ref1) {
        if (!__hasProp.call(_ref1, key)) continue;
        list = _ref1[key];
        section = $("section[data-date='" + key + "']");
        this.updateHeader(section, list, this.show.venue().capacity());
        _results.push((function() {
          var _i, _len, _results1;
          _results1 = [];
          for (_i = 0, _len = list.length; _i < _len; _i++) {
            booking = list[_i];
            _results1.push(section.find(".bookings").append(this.renderBooking(booking)));
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    BookingsController.prototype.renderBooking = function(booking) {
      var data, row;
      data = $.extend({}, booking.toJSON(), {
        payment: booking.payment().ucfirst(),
        unpaid: booking.paid() ? "" : booking.tickets(),
        paid: booking.paid() ? booking.tickets() : "",
        total: booking.tickets(),
        amount: booking.amount().dollars()
      });
      row = $(Milk.render(this.constructor.BOOKING, data));
      row.attr("data-reference", booking.id);
      if (booking.paid()) {
        row.addClass("paid").find(".btn").addClass("btn-success").text("Paid").end();
      }
      return row;
    };

    BookingsController.prototype.update = function(booking) {
      var b;
      this.$("[data-reference='" + booking.id + "']").replaceWith(this.renderBooking(booking));
      this.updateHeader(this.$("[data-date='" + (booking.date().db()) + "']"), (function() {
        var _i, _len, _ref1, _results;
        _ref1 = Booking.all();
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          b = _ref1[_i];
          if (b.date().getTime() === booking.date().getTime()) {
            _results.push(b);
          }
        }
        return _results;
      })(), this.show.venue().capacity());
      return this.updateHeader(this.$(".total"), Booking.all(), this.show.dates().length * this.show.venue().capacity());
    };

    BookingsController.prototype.updateHeader = function(section, bookings, max) {
      var booking, key, stats, value, _i, _len, _results;
      stats = {
        unpaid: 0,
        paid: 0,
        total: 0
      };
      for (_i = 0, _len = bookings.length; _i < _len; _i++) {
        booking = bookings[_i];
        stats.unpaid += +(!booking.paid()) * booking.tickets();
        stats.paid += +booking.paid() * booking.tickets();
        stats.total += booking.tickets();
      }
      _results = [];
      for (key in stats) {
        if (!__hasProp.call(stats, key)) continue;
        value = stats[key];
        $("header .stat[rel=" + key + "]", section).html(value || "&nbsp;");
        _results.push($("header .progress-bar[rel=" + key + "]", section).animate({
          width: "" + (value * 100.0 / max) + "%"
        }));
      }
      return _results;
    };

    BookingsController.prototype.open = function(e) {
      return $(e.target).closest(".performance").addClass("open");
    };

    BookingsController.prototype.collapse = function(e) {
      return $(e.target).closest(".performance").removeClass("open");
    };

    BookingsController.prototype.bookingFromElement = function(el) {
      return Booking.exists($(el).closest(".booking").attr("data-reference"));
    };

    BookingsController.prototype.togglePayment = function(e) {
      var booking;
      if (booking = this.bookingFromElement(e.target)) {
        return booking.updateAttributes({
          paid: !booking.paid()
        });
      }
    };

    return BookingsController;

  })(Spine.Controller);

  $(function() {
    return new BookingsController({
      el: ".container"
    });
  });

}).call(this);
