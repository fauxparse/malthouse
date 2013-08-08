(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.Booking = (function(_super) {

    __extends(Booking, _super);

    function Booking() {
      Booking.__super__.constructor.apply(this, arguments);
    }

    Booking.configure("Booking", "reference", "show_id", "date", "tickets", "name", "email", "phone", "payment");

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

    Booking.prototype.date = function(date) {
      if (date != null) {
        this._date = new Date(Date.parse(date));
      }
      return this._date;
    };

    Booking.prototype.tickets = function(tickets) {
      if (tickets != null) {
        this._tickets = parseInt(tickets, 10);
      }
      return this._tickets;
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
      var _ref;
      if (total != null) {
        this._total = total;
      }
      return (_ref = this._total) != null ? _ref : this.show().price() * this.tickets();
    };

    Booking.prototype.toJSON = function() {
      var _ref;
      return $.extend({}, Booking.__super__.toJSON.apply(this, arguments), {
        date: (_ref = this.date()) != null ? _ref.db() : void 0
      });
    };

    return Booking;

  })(Spine.Model);

}).call(this);
