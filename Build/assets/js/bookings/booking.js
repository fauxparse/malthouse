(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.Booking = (function(_super) {
    __extends(Booking, _super);

    function Booking() {
      _ref = Booking.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Booking.configure("Booking", "show_id", "date", "tickets", "name", "email", "phone", "payment", "paid", "amount");

    Booking.extend(Spine.Model.Ajax);

    Booking.EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    Booking.prototype.show_id = function(show_id) {
      if (show_id != null) {
        this._show_id = show_id;
      }
      return this._show_id;
    };

    Booking.prototype.name = function(name) {
      if (name != null) {
        this._name = name;
      }
      return this._name;
    };

    Booking.prototype.email = function(email) {
      if (email != null) {
        this._email = email;
      }
      return this._email;
    };

    Booking.prototype.phone = function(phone) {
      if (phone != null) {
        this._phone = phone;
      }
      return this._phone;
    };

    Booking.prototype.payment = function(payment) {
      if (payment != null) {
        this._payment = payment;
      }
      return this._payment;
    };

    Booking.prototype.paid = function(paid) {
      if (paid != null) {
        this._paid = !!paid;
      }
      return this._paid;
    };

    Booking.prototype.date = function(date) {
      if (date != null) {
        this._date = new Date(Date.parseDB(date));
      }
      return this._date;
    };

    Booking.prototype.tickets = function(tickets) {
      if (tickets != null) {
        this._tickets = parseInt(tickets, 10);
      }
      return this._tickets;
    };

    Booking.prototype.amount = function(amount) {
      if (amount != null) {
        this._amount = parseInt(amount, 10);
      }
      return this._amount;
    };

    Booking.prototype.show = function() {
      return Show.find(this.show_id());
    };

    Booking.prototype.validate = function() {
      var errors, key;
      errors = {};
      if (!this.show_id()) {
        errors.show_id = "Please select a show";
      }
      if (!this.date()) {
        errors.date = "Please select a performance";
      }
      if (!this.name()) {
        errors.name = "Please fill in your name";
      }
      if (!(this.email() || this.phone())) {
        errors.email = "Please fill in your email address or phone number";
      }
      if (this.email() && !this.email().match(this.constructor.EMAIL)) {
        errors.email = "Please check your email address";
      }
      if (isNaN(this.tickets()) || (this.tickets() < 1)) {
        errors.tickets = "Please select a number of tickets";
      }
      for (key in errors) {
        if (!__hasProp.call(errors, key)) continue;
        return errors;
      }
    };

    Booking.prototype.total = function(total) {
      var _ref1;
      if (total != null) {
        this._total = total;
      }
      return (_ref1 = this._total) != null ? _ref1 : this.show().price() * this.tickets();
    };

    Booking.prototype.toJSON = function() {
      var json, _ref1;
      json = Booking.__super__.toJSON.apply(this, arguments);
      return $.extend({}, json, {
        date: (_ref1 = this.date()) != null ? _ref1.db() : void 0
      });
    };

    Booking.fetchSummary = function() {
      var promise;
      promise = $.Deferred();
      $.getJSON("/bookings").done(function(data) {
        Show.refresh(data.shows);
        return promise.resolve();
      });
      return promise;
    };

    Booking.partition = function() {
      return this.all().reduce(function(hash, booking) {
        var _name;
        return (hash[_name = booking.date().db()] != null ? hash[_name = booking.date().db()] : hash[_name] = []).push(booking) && hash;
      }, {});
    };

    return Booking;

  })(Spine.Model);

}).call(this);
