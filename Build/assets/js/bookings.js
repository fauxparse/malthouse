(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Number.prototype.pad = function(n) {
    var str;
    if (n == null) {
      n = 2;
    }
    str = this.toString();
    while (str.length < 2) {
      str = "0" + str;
    }
    return str;
  };

  Date.MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  Date.DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  Date.prototype.db = function() {
    return "" + (this.getFullYear()) + "-" + ((this.getMonth() + 1).pad()) + "-" + (this.getDate().pad()) + " " + (this.getHours().pad()) + ":" + (this.getMinutes().pad());
  };

  Date.prototype.label = function() {
    return "" + Date.DAYS[this.getDay()] + ", " + (this.getDate()) + " " + Date.MONTHS[this.getMonth()] + ", " + ((this.getHours() - 1) % 12 + 1) + ":" + (this.getMinutes().pad()) + (this.getHours() < 12 ? "am" : "pm");
  };

  window.Show = (function(_super) {

    __extends(Show, _super);

    function Show() {
      Show.__super__.constructor.apply(this, arguments);
    }

    Show.configure("Show", "title", "byline", "dates", "venue");

    Show.prototype.title = function(title) {
      if (title != null) {
        this._title = title;
      }
      return this._title;
    };

    Show.prototype.byline = function(byline) {
      if (byline != null) {
        this._byline = byline;
      }
      return this._byline;
    };

    Show.prototype.dates = function(dates) {
      var date;
      if (dates != null) {
        this._dates = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = dates.length; _i < _len; _i++) {
            date = dates[_i];
            _results.push(new Date(Date.parse(date)));
          }
          return _results;
        })();
      }
      return (this._dates || []).slice(0);
    };

    Show.fetch = function() {
      var _this = this;
      return $.getJSON("/shows.json").done(function(data) {
        Venue.refresh(data.venues);
        return Show.refresh(data.shows);
      });
    };

    return Show;

  })(Spine.Model);

  window.Venue = (function(_super) {

    __extends(Venue, _super);

    function Venue() {
      Venue.__super__.constructor.apply(this, arguments);
    }

    Venue.configure("Venue", "name", "address", "phone", "geo");

    return Venue;

  })(Spine.Model);

  window.Booking = (function(_super) {

    __extends(Booking, _super);

    function Booking() {
      Booking.__super__.constructor.apply(this, arguments);
    }

    Booking.configure("Booking", "show_id", "date", "tickets", "name", "email", "phone", "payment");

    Booking.prototype.show = function() {
      return Show.find(this.showId);
    };

    return Booking;

  })(Spine.Model);

  window.BookingForm = (function(_super) {

    __extends(BookingForm, _super);

    function BookingForm() {
      this.hide = __bind(this.hide, this);
      this.show = __bind(this.show, this);
      BookingForm.__super__.constructor.apply(this, arguments);
    }

    BookingForm.prototype.elements = {
      ".modal-content": "dialog"
    };

    BookingForm.prototype.events = {
      "hidden": "release",
      "click [rel=minus]": "minus",
      "click [rel=plus]": "plus"
    };

    BookingForm.template = "    <div class=\"modal-dialog\">      <div class=\"modal-content\">        <div class=\"modal-header\">          <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>          <h4 class=\"modal-title\">Book tickets online</h4>        </div>        <div class=\"modal-body\">          <form class=\"form-horizontal\">            <div class=\"form-group\">              <label class=\"col-lg-4 control-label\">Choose a show</label>              <input type=\"hidden\" name=\"show_id\" value=\"\">              <div class=\"col-lg-8\">                <div class=\"btn-group btn-block\">                  <button type=\"button\" class=\"btn btn-default dropdown-toggle btn-block btn-info\" data-toggle=\"dropdown\">                    {{show}} <span class=\"caret\"></span>                  </button>                  <ul class=\"dropdown-menu\">                    {{#shows}}                      <li><a href=\"#\" data-show=\"{{id}}\">{{title}}</a></li>                    {{/shows}}                  </ul>                </div>              </div>            </div>            <div class=\"form-group\">              <label class=\"col-lg-4 control-label\">Choose a performance</label>              <input type=\"hidden\" name=\"date\" value=\"\">              <div class=\"col-lg-8\">                <div class=\"btn-group btn-block\">                  <button type=\"button\" class=\"btn btn-default dropdown-toggle btn-block btn-info\" data-toggle=\"dropdown\">                    {{date}} <span class=\"caret\"></span>                  </button>                  <ul class=\"dropdown-menu\">                    {{#dates}}                      <li><a href=\"#\" data-date=\"{{date}}\">{{label}}</a></li>                    {{/dates}}                  </ul>                </div>              </div>            </div>            <div class=\"form-group\">              <label class=\"col-lg-4 control-label\">Number of tickets</label>              <div class=\"col-lg-3\">                <div class=\"input-group\">                  <span class=\"input-group-btn\">                    <button class=\"btn btn-default\" type=\"button\" rel=\"minus\">-</button>                  </span>                  <input type=\"text\" class=\"form-control\" name=\"tickets\" value=\"2\">                  <span class=\"input-group-btn\">                    <button class=\"btn btn-default\" type=\"button\" rel=\"plus\">+</button>                  </span>                </div>              </div>            </div>            <div class=\"form-group\">              <label class=\"col-lg-4 control-label\">Your name</label>              <div class=\"col-lg-8\">                <input type=\"text\" name=\"name\" class=\"form-control\">              </div>            </div>            <div class=\"form-group\">              <label class=\"col-lg-4 control-label\">Your email</label>              <div class=\"col-lg-8\">                <input type=\"email\" name=\"email\" class=\"form-control\">              </div>            </div>            <div class=\"form-group\">              <label class=\"col-lg-4 control-label\">Your phone number</label>              <div class=\"col-lg-8\">                <input type=\"phone\" name=\"phone\" class=\"form-control\">              </div>            </div>            <div class=\"form-group\">              <label class=\"col-lg-4 control-label\">Payment method</label>              <div class=\"col-lg-8\">                <div class=\"radio\">                  <label>                    <input type=\"radio\" name=\"payment\" value=\"internet\" checked>                    Internet banking                  </label>                </div>                <div class=\"radio\">                  <label>                    <input type=\"radio\" name=\"payment\" value=\"cash\">                    Cash on the door (sorry, no EFT-POS!)                  </label>                </div>              </div>            </div>          </form>        </div>        <div class=\"modal-footer\">          <button type=\"button\" class=\"btn btn-default pull-left\">More information</button>          <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Cancel</button>          <button type=\"button\" class=\"btn btn-success\">Submit booking</button>        </div>      </div>    </div>    ";

    BookingForm.prototype.init = function() {
      this.el.addClass("booking modal fade");
      this.append($("<div>", {
        "class": "modal-content"
      }));
      this.dialog.wrap("<div class=\"modal-dialog\">");
      return this.render();
    };

    BookingForm.prototype.render = function() {
      var date, dates, show;
      show = this.booking.show();
      dates = (function() {
        var _i, _len, _ref, _results;
        _ref = show.dates();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          date = _ref[_i];
          _results.push({
            date: date.db(),
            label: date.label()
          });
        }
        return _results;
      })();
      return this.html(Milk.render(this.constructor.template, {
        show: show.title(),
        shows: (function() {
          var _i, _len, _ref, _results;
          _ref = Show.all();
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            show = _ref[_i];
            _results.push({
              id: show.id,
              title: show.title()
            });
          }
          return _results;
        })(),
        date: dates[0].label,
        dates: dates
      }));
    };

    BookingForm.prototype.show = function() {
      return this.el.modal("show");
    };

    BookingForm.prototype.hide = function() {
      return this.el.modal("hide");
    };

    BookingForm.prototype.changeNumberOfTickets = function(e, inc) {
      var input, v;
      if (inc == null) {
        inc = 1;
      }
      input = $(e.target).closest(".input-group").find("input");
      v = parseInt(input.val(), 10);
      if (isNaN(v)) {
        v = 1;
      }
      return input.val(Math.max(v + inc, 1));
    };

    BookingForm.prototype.minus = function(e) {
      return this.changeNumberOfTickets(e, -1);
    };

    BookingForm.prototype.plus = function(e) {
      return this.changeNumberOfTickets(e, 1);
    };

    return BookingForm;

  })(Spine.Controller);

  $(function() {
    return Show.fetch().done(function() {
      return $("body").on("click", "a[rel=book]", function(e) {
        var booking, form;
        e.preventDefault();
        booking = new Booking({
          showId: $(e.target).attr("data-show")
        });
        form = new BookingForm({
          booking: booking
        });
        return form.show();
      });
    });
  });

}).call(this);
