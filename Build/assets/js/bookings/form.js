(function() {
  var _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.BookingForm = (function(_super) {
    __extends(BookingForm, _super);

    function BookingForm() {
      this.error = __bind(this.error, this);
      this.success = __bind(this.success, this);
      this.hide = __bind(this.hide, this);
      this.show = __bind(this.show, this);
      this.hidden = __bind(this.hidden, this);
      this.shown = __bind(this.shown, this);
      _ref = BookingForm.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    BookingForm.template = "    <div class=\"modal-dialog\">      <div class=\"modal-content\">        <div class=\"modal-header\">          <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>          <h4 class=\"modal-title\">Book tickets online</h4>        </div>        <div class=\"modal-body\">          <form class=\"form-horizontal\">            <div class=\"form-group\" rel=\"shows\">              <label class=\"col-sm-4 control-label\">Choose a show</label>              <input type=\"hidden\" name=\"show_id\" value=\"\">              <div class=\"col-sm-8\">                <div class=\"btn-group btn-block\">                  <button type=\"button\" class=\"btn btn-default dropdown-toggle btn-block btn-info\" data-toggle=\"dropdown\">                    <span class=\"current\">{{show}}</span> <span class=\"caret\"></span>                  </button>                  <ul class=\"dropdown-menu\">                    {{#shows}}                      <li><a href=\"#\" data-value=\"{{id}}\">{{title}}</a></li>                    {{/shows}}                  </ul>                </div>              </div>            </div>            <div class=\"form-group\" rel=\"performances\">              <label class=\"col-sm-4 control-label\">Choose a performance</label>              <input type=\"hidden\" name=\"date\" value=\"\">              <div class=\"col-sm-8\">                <div class=\"btn-group btn-block\">                  <button type=\"button\" class=\"btn btn-default dropdown-toggle btn-block btn-info\" data-toggle=\"dropdown\">                    <span class=\"current\">{{date}}</span> <span class=\"caret\"></span>                  </button>                  <ul class=\"dropdown-menu\">                    {{#dates}}                      <li><a href=\"#\" data-value=\"{{date}}\">{{label}}</a></li>                    {{/dates}}                  </ul>                </div>              </div>            </div>            <div class=\"form-group\">              <label class=\"col-sm-4 control-label\">Number of tickets</label>              <div class=\"col-sm-3\">                <div class=\"input-group\">                  <span class=\"input-group-btn\">                    <button class=\"btn btn-default\" type=\"button\" rel=\"minus\">-</button>                  </span>                  <input type=\"text\" class=\"form-control\" name=\"tickets\" value=\"2\">                  <span class=\"input-group-btn\">                    <button class=\"btn btn-default\" type=\"button\" rel=\"plus\">+</button>                  </span>                </div>              </div>              <div class=\"col-sm-5 ticket-pricing\">                &times; <span class=\"ticket-price\">$7</span> = <span class=\"total-price\">$14</span>              </div>            </div>            <div class=\"form-group\">              <label class=\"col-sm-4 control-label\">Your name</label>              <div class=\"col-sm-8\">                <input type=\"text\" name=\"name\" class=\"form-control\">              </div>            </div>            <div class=\"form-group\">              <label class=\"col-sm-4 control-label\">Your email</label>              <div class=\"col-sm-8\">                <input type=\"email\" name=\"email\" class=\"form-control\">              </div>            </div>            <div class=\"form-group\">              <label class=\"col-sm-4 control-label\">Your phone number</label>              <div class=\"col-sm-8\">                <input type=\"phone\" name=\"phone\" class=\"form-control\">              </div>            </div>            <div class=\"form-group\">              <label class=\"col-sm-4 control-label\">Payment method</label>              <div class=\"col-sm-8\">                <div class=\"radio\">                  <label>                    <input type=\"radio\" name=\"payment\" value=\"internet\" checked>                    Internet banking                  </label>                </div>                <div class=\"radio\">                  <label>                    <input type=\"radio\" name=\"payment\" value=\"cash\">                    Cash on the door (sorry, no EFT-POS!)                  </label>                </div>              </div>            </div>            <div class=\"form-group\">              <label class=\"col-sm-4 control-label\">Other comments</label>              <div class=\"col-sm-8\">                <textarea name=\"comments\" class=\"form-control\" rows=\"3\"></textarea>              </div>            </div>          </form>          <div class=\"loading-overlay\" style=\"display: none;\"><h4>Processing booking…</h4></div>        </div>        <div class=\"modal-footer\">          <button type=\"button\" class=\"btn btn-default\" rel=\"cancel\" data-dismiss=\"modal\">Cancel</button>          <button type=\"button\" class=\"btn btn-success\" rel=\"submit\" disabled>Submit booking</button>        </div>      </div>    </div>    ";

    BookingForm.successTemplate = "    <h3>Thanks for booking!</h3>    <p>Your booking number is <strong>{{id}}</strong>.</p>    {{#internetBanking}}    <p>Please use this number as a reference when making your payment of <strong>{{total}}</strong>. Our account details are:</p>    <blockquote>      <p>        Canterbury Children’s Theatre Inc<br>        03-1594-0586102-00      <p>    </blockquote>    {{/internetBanking}}    {{^internetBanking}}    <p>Please bring <strong>{{total}}</strong> cash (or a cheque made out to Canterbury Children’s Theatre, Inc) to the performance with you. <strong>Sorry, we are unable to accept EFT-POS or credit cards at the theatre.</strong></p>    {{/internetBanking}}    {{#email}}    <p>We’ve emailed you a copy of this booking for your records, but you don’t need to bring it with you on the day.</p>    {{/email}}    <p>We’ll see you on <strong>{{date}}</strong>! The show starts at <strong>{{time}}</strong>, but please arrive around 15–20 minutes early.</p>    ";

    BookingForm.prototype.elements = {
      "form": "form",
      ".modal-content": "dialog",
      "[rel=shows] .current": "currentShow",
      "[rel=shows] .dropdown-menu": "showMenu",
      "[rel=performances] .current": "currentPerformance",
      "[rel=performances] .dropdown-menu": "performanceMenu",
      "[name=tickets]": "numberOfTickets",
      ".loading-overlay": "overlay"
    };

    BookingForm.prototype.events = {
      "mousedown [rel=minus], [rel=plus]": "startCount",
      "tick [rel=minus]": "minus",
      "tick [rel=plus]": "plus",
      "click .dropdown-menu [data-value]": "dropdownChanged",
      "change [name=show_id]": "updateDates",
      "click [rel=submit]": "submit",
      "submit form": "submit",
      "keypress :input": "keypress"
    };

    BookingForm.url = "/bookings";

    BookingForm.prototype.init = function() {
      this.el.addClass("booking modal fade").on("shown.bs.modal", this.shown).on("hidden.bs.modal", this.hidden);
      this.append($("<div>", {
        "class": "modal-content"
      }));
      this.dialog.wrap("<div class=\"modal-dialog\">");
      this.render();
      return Booking.bind("ajaxSuccess", this.success).bind("ajaxError", this.error);
    };

    BookingForm.prototype.shown = function() {
      return this.$("[name=name]").focus();
    };

    BookingForm.prototype.hidden = function() {
      return this.immediately(this.release);
    };

    BookingForm.prototype.day = function(date) {
      date || (date = new Date);
      return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 4, 0);
    };

    BookingForm.prototype.isInFuture = function(date) {
      return this.day(date) > this.day();
    };

    BookingForm.prototype.formatDate = function(date, open) {
      var d;
      if (open == null) {
        open = true;
      }
      d = new Date(Date.parseDB(date));
      return {
        date: d.db(),
        label: d.label(),
        open: open && this.isInFuture(d)
      };
    };

    BookingForm.prototype.formatDates = function(dates) {
      var date, open, result;
      result = [];
      for (date in dates) {
        if (!__hasProp.call(dates, date)) continue;
        open = dates[date];
        result.push(this.formatDate(date, open));
      }
      return result;
    };

    BookingForm.prototype.render = function() {
      var s, show;
      show = this.booking.show();
      this.html(Milk.render(this.constructor.template, {
        show: show.title(),
        shows: (function() {
          var _i, _len, _ref1, _results;
          _ref1 = Show.all();
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            s = _ref1[_i];
            if (s.visible()) {
              _results.push({
                id: s.id,
                title: s.title()
              });
            }
          }
          return _results;
        })()
      }));
      this.$("[name=show_id]").val(show.id);
      return this.updateDates();
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
      input.val(Math.max(v + inc, 1)).trigger("change");
      return this.updatePrices();
    };

    BookingForm.prototype.startCount = function(e) {
      var button, initial,
        _this = this;
      e.preventDefault();
      button = $(e.target).trigger("tick");
      initial = this.after(500, function() {
        var ticker;
        ticker = _this.every(100, function() {
          return button.trigger("tick");
        });
        return $(window).one("mouseup", function() {
          return clearInterval(ticker);
        });
      });
      return $(window).one("mouseup", function() {
        return clearTimeout(initial);
      });
    };

    BookingForm.prototype.minus = function(e) {
      return this.changeNumberOfTickets(e, -1);
    };

    BookingForm.prototype.plus = function(e) {
      return this.changeNumberOfTickets(e, 1);
    };

    BookingForm.prototype.dropdownChanged = function(e) {
      var input, newValue, oldValue, target;
      e.preventDefault();
      target = $(e.target).closest("a");
      input = target.closest(".form-group").find("input");
      newValue = target.attr("data-value");
      oldValue = input.val();
      if (newValue !== oldValue) {
        target.closest(".form-group").find(".current").html(target.html());
        return input.val(newValue).trigger("change");
      }
    };

    BookingForm.prototype.updateDates = function(e) {
      var date, dates, first, _i, _len, _results;
      this.booking.show_id(this.$("[name=show_id]").val());
      this.currentShow.text(this.booking.show().title());
      this.$(".show-note").remove();
      if (this.booking.show().note != null) {
        $("<div>", {
          "class": "alert alert-info show-note",
          html: this.booking.show().note
        }).prependTo(this.form);
      }
      dates = this.formatDates(this.booking.show().dates());
      first = ((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = dates.length; _i < _len; _i++) {
          date = dates[_i];
          if (date.open) {
            _results.push(date);
          }
        }
        return _results;
      })())[0];
      if (first) {
        this.$("[name=date]").val(first.date);
        this.currentPerformance.html(first.label);
        this.$("[rel=submit]").removeProp("disabled");
      } else {
        this.currentPerformance.html("SOLD OUT!");
      }
      this.performanceMenu.empty();
      _results = [];
      for (_i = 0, _len = dates.length; _i < _len; _i++) {
        date = dates[_i];
        _results.push($("<a href=\"#\">").html(date.label).attr("data-value", date.date).prop("disabled", !date.open).toggleClass("disabled", !date.open).appendTo(this.performanceMenu).wrap("<li>"));
      }
      return _results;
    };

    BookingForm.prototype.updatePrices = function() {
      var n;
      n = parseInt(this.numberOfTickets.val(), 10);
      if (isNaN(n)) {
        n = 1;
      }
      this.$(".ticket-price").text(this.booking.show().price().dollars());
      return this.$(".total-price").text((n * this.booking.show().price()).dollars());
    };

    BookingForm.prototype.submit = function() {
      var booking, errors, key, message, _results;
      booking = Booking.fromForm(this.form);
      this.$(".alert-danger").remove();
      this.$(".has-error").removeClass("has-error").find(".help-block").remove().end();
      if (errors = booking.validate()) {
        _results = [];
        for (key in errors) {
          if (!__hasProp.call(errors, key)) continue;
          message = errors[key];
          this.$("[name=" + key + "]").closest(".form-group").addClass("has-error").find("label").next("div").append($("<div class=\"help-block\">").html(message));
          _results.push(this.$(".has-errors input").first().focus());
        }
        return _results;
      } else {
        this.overlay.fadeIn();
        return booking.save();
      }
    };

    BookingForm.prototype.success = function(booking) {
      this.form.replaceWith(this.bookingSuccessMessage(booking));
      this.$(".modal-footer [rel=submit]").remove();
      this.$(".modal-footer [rel=cancel]").html("OK");
      return this.overlay.fadeOut();
    };

    BookingForm.prototype.bookingSuccessMessage = function(booking) {
      var data;
      data = $.extend({}, booking.toJSON(), {
        internetBanking: booking.payment() === "internet",
        total: booking.total().dollars(),
        date: booking.date().date(),
        time: booking.date().time()
      });
      return Milk.render(this.constructor.successTemplate, data);
    };

    BookingForm.prototype.error = function(record, xhr, settings, error) {
      this.overlay.fadeOut();
      return $("<div>").addClass("alert alert-danger").html("<strong>Sorry!</strong> There was a problem processing your booking. Please check your details and try again, or call us now on <strong>0800 BOOKINGS</strong>").prependTo(this.form);
    };

    BookingForm.prototype.keypress = function(e) {
      if (e.which === 13) {
        return this.submit();
      }
    };

    return BookingForm;

  })(Spine.Controller);

}).call(this);
