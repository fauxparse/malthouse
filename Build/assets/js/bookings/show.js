(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.Venue = (function(_super) {

    __extends(Venue, _super);

    function Venue() {
      Venue.__super__.constructor.apply(this, arguments);
    }

    Venue.configure("Venue", "name", "address", "phone", "geo");

    return Venue;

  })(Spine.Model);

  window.Show = (function(_super) {

    __extends(Show, _super);

    function Show() {
      Show.__super__.constructor.apply(this, arguments);
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

    Show.prototype.price = function(price) {
      if (price != null) {
        this._price = parseInt(price, 10);
      }
      return this._price;
    };

    Show.fetch = function() {
      var _this = this;
      return $.getJSON("/shows.json").done(function(data) {
        return Show.refresh(data.shows);
      });
    };

    return Show;

  })(Spine.Model);

}).call(this);
