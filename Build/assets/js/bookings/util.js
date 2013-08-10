(function() {

  String.prototype.ucfirst = function() {
    return this.substr(0, 1).toUpperCase() + this.substr(1);
  };

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

  Number.prototype.dollars = function() {
    var cents;
    cents = this % 100;
    cents = cents === 0 ? "" : cents < 10 ? ".0" + cents : "." + cents;
    return "$" + (Math.floor(this / 100)) + cents;
  };

  Date.MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  Date.DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  Date.prototype.db = function() {
    return "" + (this.getFullYear()) + "-" + ((this.getMonth() + 1).pad()) + "-" + (this.getDate().pad()) + " " + (this.getHours().pad()) + ":" + (this.getMinutes().pad());
  };

  Date.parseDB = function(date) {
    var p, parts;
    if (typeof date !== "string") {
      return date;
    }
    parts = (function() {
      var _i, _len, _ref, _results;
      _ref = date.split(/[^\d]+/);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        p = _ref[_i];
        _results.push(parseInt(p, 10));
      }
      return _results;
    })();
    return new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4]);
  };

  Date.prototype.label = function() {
    return "" + (this.date()) + ", " + (this.time());
  };

  Date.prototype.date = function() {
    return "" + Date.DAYS[this.getDay()] + ", " + (this.getDate()) + " " + Date.MONTHS[this.getMonth()];
  };

  Date.prototype.time = function() {
    return "" + ((this.getHours() - 1) % 12 + 1) + ":" + (this.getMinutes().pad()) + (this.getHours() < 12 ? "am" : "pm");
  };

  Spine.Controller.prototype.after = function(timeout, callback) {
    return setTimeout(callback, timeout);
  };

  Spine.Controller.prototype.immediately = function(callback) {
    return this.after(0, callback);
  };

  Spine.Controller.prototype.every = function(interval, callback) {
    return setInterval(callback, interval);
  };

}).call(this);
