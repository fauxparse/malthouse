(function() {
  var _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.Venue = (function(_super) {
    __extends(Venue, _super);

    function Venue() {
      _ref = Venue.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Venue.configure("Venue", "name", "address", "phone", "geo", "capacity");

    Venue.prototype.capacity = function(capacity) {
      if (capacity != null) {
        this._capacity = parseInt(capacity, 10);
      }
      return this._capacity;
    };

    return Venue;

  })(Spine.Model);

  window.Show = (function(_super) {
    __extends(Show, _super);

    function Show() {
      _ref1 = Show.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    Show.configure("Show", "title", "byline", "dates", "venue", "price");

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
      if (dates != null) {
        this._parsedDates = void 0;
        this._dates = $.extend({}, dates);
      }
      return this._dates || {};
    };

    Show.prototype.parsedDates = function() {
      var date, open, _ref2;
      if (this._parsedDates == null) {
        this._parsedDates = [];
        _ref2 = this.dates();
        for (date in _ref2) {
          if (!__hasProp.call(_ref2, date)) continue;
          open = _ref2[date];
          this._parsedDates.push(new Date(Date.parseDB(date)));
        }
        this._parsedDates.sort(function(a, b) {
          a = a.getTime();
          b = b.getTime();
          if (a < b) {
            return -1;
          } else if (a > b) {
            return 1;
          } else {
            return 0;
          }
        });
        console.log(this._parsedDates);
      }
      return this._parsedDates;
    };

    Show.prototype.price = function(price) {
      if (price != null) {
        this._price = parseInt(price, 10);
      }
      return this._price;
    };

    Show.prototype.venue = function(venue) {
      if (venue != null) {
        this._venue_id = venue.id || venue;
      }
      return Venue.find(this._venue_id);
    };

    Show.fetch = function() {
      var _this = this;
      return $.getJSON("/shows").done(function(data, textStatus, xhr) {
        Venue.refresh(data.venues);
        return Show.refresh(data.shows);
      });
    };

    return Show;

  })(Spine.Model);

}).call(this);
