!function(){String.prototype.ucfirst=function(){return this.substr(0,1).toUpperCase()+this.substr(1)},Number.prototype.pad=function(t){var e;for(null==t&&(t=2),e=this.toString();e.length<2;)e="0"+e;return e},Number.prototype.dollars=function(){var t;return t=this%100,t=0===t?"":10>t?".0"+t:"."+t,"$"+Math.floor(this/100)+t},Date.MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"],Date.DAYS=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],Date.prototype.db=function(){return""+this.getFullYear()+"-"+(this.getMonth()+1).pad()+"-"+this.getDate().pad()+" "+this.getHours().pad()+":"+this.getMinutes().pad()},Date.parseDB=function(t){var e,o;return"string"!=typeof t?t:(o=function(){var o,n,r,s;for(r=t.split(/[^\d]+/),s=[],o=0,n=r.length;n>o;o++)e=r[o],s.push(parseInt(e,10));return s}(),new Date(o[0],o[1]-1,o[2],o[3],o[4]))},Date.prototype.label=function(){return""+this.date()+", "+this.time()},Date.prototype.date=function(){return""+Date.DAYS[this.getDay()]+", "+this.getDate()+" "+Date.MONTHS[this.getMonth()]},Date.prototype.time=function(){return""+((this.getHours()-1)%12+1)+":"+this.getMinutes().pad()+(this.getHours()<12?"am":"pm")},"undefined"!=typeof Spine&&null!==Spine&&(Spine.Controller.prototype.after=function(t,e){return setTimeout(e,t)},Spine.Controller.prototype.immediately=function(t){return this.after(0,t)},Spine.Controller.prototype.every=function(t,e){return setInterval(e,t)})}.call(this),function(){var t,e,o={}.hasOwnProperty,n=function(t,e){function n(){this.constructor=t}for(var r in e)o.call(e,r)&&(t[r]=e[r]);return n.prototype=e.prototype,t.prototype=new n,t.__super__=e.prototype,t};window.Venue=function(e){function o(){return t=o.__super__.constructor.apply(this,arguments)}return n(o,e),o.configure("Venue","name","address","phone","geo","capacity"),o.prototype.capacity=function(t){return null!=t&&(this._capacity=parseInt(t,10)),this._capacity},o}(Spine.Model),window.Show=function(t){function r(){return e=r.__super__.constructor.apply(this,arguments)}return n(r,t),r.configure("Show","title","byline","dates","venue","price","note"),r.prototype.title=function(t){return null!=t&&(this._title=t),this._title},r.prototype.byline=function(t){return null!=t&&(this._byline=t),this._byline},r.prototype.dates=function(t){return null!=t&&(this._parsedDates=void 0,this._dates=$.extend({},t)),this._dates||{}},r.prototype.parsedDates=function(){var t,e,n;if(null==this._parsedDates){this._parsedDates=[],n=this.dates();for(t in n)o.call(n,t)&&(e=n[t],this._parsedDates.push(new Date(Date.parseDB(t))));this._parsedDates.sort(function(t,e){return t=t.getTime(),e=e.getTime(),e>t?-1:t>e?1:0})}return this._parsedDates},r.prototype.visible=function(){return Math.max.apply(Math,this.parsedDates())>+new Date},r.prototype.price=function(t){return null!=t&&(this._price=parseInt(t,10)),this._price},r.prototype.venue=function(t){return null!=t&&(this._venue_id=t.id||t),Venue.find(this._venue_id)},r.fetch=function(){return $.getJSON("/shows").done(function(t){return Venue.refresh(t.venues),r.refresh(t.shows)})},r}(Spine.Model)}.call(this),function(){var t,e={}.hasOwnProperty,o=function(t,o){function n(){this.constructor=t}for(var r in o)e.call(o,r)&&(t[r]=o[r]);return n.prototype=o.prototype,t.prototype=new n,t.__super__=o.prototype,t};window.Booking=function(n){function r(){return t=r.__super__.constructor.apply(this,arguments)}return o(r,n),r.configure("Booking","show_id","date","tickets","name","email","phone","payment","paid","amount","comments"),r.extend(Spine.Model.Ajax),r.EMAIL=/^[^\s@]+@[^\s@]+\.[^\s@]+$/,r.prototype.show_id=function(t){return null!=t&&(this._show_id=t),this._show_id},r.prototype.name=function(t){return null!=t&&(this._name=t),this._name},r.prototype.email=function(t){return null!=t&&(this._email=t),this._email},r.prototype.phone=function(t){return null!=t&&(this._phone=t),this._phone},r.prototype.payment=function(t){return null!=t&&(this._payment=t),this._payment},r.prototype.paid=function(t){return null!=t&&(this._paid=!!t),this._paid},r.prototype.date=function(t){return t&&(this._date=new Date(Date.parseDB(t))),this._date},r.prototype.tickets=function(t){return null!=t&&(this._tickets=parseInt(t,10)),this._tickets},r.prototype.amount=function(t){return null!=t&&(this._amount=parseInt(t,10)),this._amount},r.prototype.show=function(){return Show.find(this.show_id())},r.prototype.validate=function(){var t,o;t={},this.show_id()||(t.show_id="Please select a show"),this.date()&&this._date.getTime&&!isNaN(this._date.getTime())||(t.date="Please select a performance"),this.name()||(t.name="Please fill in your name"),this.email()||this.phone()||(t.email="Please fill in your email address or phone number"),this.email()&&!this.email().match(this.constructor.EMAIL)&&(t.email="Please check your email address"),(isNaN(this.tickets())||this.tickets()<1)&&(t.tickets="Please select a number of tickets");for(o in t)if(e.call(t,o))return t},r.prototype.total=function(t){var e;return null!=t&&(this._total=t),null!=(e=this._total)?e:this.show().price()*this.tickets()},r.prototype.toJSON=function(){var t,e;return t=r.__super__.toJSON.apply(this,arguments),$.extend({},t,{date:null!=(e=this.date())?e.db():void 0})},r.fetchSummary=function(){var t;return t=$.Deferred(),$.getJSON("/bookings").done(function(e){return Show.refresh(e.shows),t.resolve()}),t},r.partition=function(){return this.all().reduce(function(t,e){var o;return(null!=t[o=e.date().db()]?t[o=e.date().db()]:t[o]=[]).push(e)&&t},{})},r}(Spine.Model)}.call(this),function(){var t,e=function(t,e){return function(){return t.apply(e,arguments)}},o={}.hasOwnProperty,n=function(t,e){function n(){this.constructor=t}for(var r in e)o.call(e,r)&&(t[r]=e[r]);return n.prototype=e.prototype,t.prototype=new n,t.__super__=e.prototype,t};window.BookingForm=function(r){function s(){return this.error=e(this.error,this),this.success=e(this.success,this),this.hide=e(this.hide,this),this.show=e(this.show,this),this.hidden=e(this.hidden,this),this.shown=e(this.shown,this),t=s.__super__.constructor.apply(this,arguments)}return n(s,r),s.template='    <div class="modal-dialog">      <div class="modal-content">        <div class="modal-header">          <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>          <h4 class="modal-title">Book tickets online</h4>        </div>        <div class="modal-body">          <form class="form-horizontal">            <div class="form-group" rel="shows">              <label class="col-sm-4 control-label">Choose a show</label>              <input type="hidden" name="show_id" value="">              <div class="col-sm-8">                <div class="btn-group btn-block">                  <button type="button" class="btn btn-default dropdown-toggle btn-block btn-info" data-toggle="dropdown">                    <span class="current">{{show}}</span> <span class="caret"></span>                  </button>                  <ul class="dropdown-menu">                    {{#shows}}                      <li><a href="#" data-value="{{id}}">{{title}}</a></li>                    {{/shows}}                  </ul>                </div>              </div>            </div>            <div class="form-group" rel="performances">              <label class="col-sm-4 control-label">Choose a performance</label>              <input type="hidden" name="date" value="">              <div class="col-sm-8">                <div class="btn-group btn-block">                  <button type="button" class="btn btn-default dropdown-toggle btn-block btn-info" data-toggle="dropdown">                    <span class="current">{{date}}</span> <span class="caret"></span>                  </button>                  <ul class="dropdown-menu">                    {{#dates}}                      <li><a href="#" data-value="{{date}}">{{label}}</a></li>                    {{/dates}}                  </ul>                </div>              </div>            </div>            <div class="form-group">              <label class="col-sm-4 control-label">Number of tickets</label>              <div class="col-sm-3">                <div class="input-group">                  <span class="input-group-btn">                    <button class="btn btn-default" type="button" rel="minus">-</button>                  </span>                  <input type="text" class="form-control" name="tickets" value="2">                  <span class="input-group-btn">                    <button class="btn btn-default" type="button" rel="plus">+</button>                  </span>                </div>              </div>              <div class="col-sm-5 ticket-pricing">                &times; <span class="ticket-price">$7</span> = <span class="total-price">$14</span>              </div>            </div>            <div class="form-group">              <label class="col-sm-4 control-label">Your name</label>              <div class="col-sm-8">                <input type="text" name="name" class="form-control">              </div>            </div>            <div class="form-group">              <label class="col-sm-4 control-label">Your email</label>              <div class="col-sm-8">                <input type="email" name="email" class="form-control">              </div>            </div>            <div class="form-group">              <label class="col-sm-4 control-label">Your phone number</label>              <div class="col-sm-8">                <input type="phone" name="phone" class="form-control">              </div>            </div>            <div class="form-group">              <label class="col-sm-4 control-label">Payment method</label>              <div class="col-sm-8">                <div class="radio">                  <label>                    <input type="radio" name="payment" value="internet" checked>                    Internet banking                  </label>                </div>                <div class="radio">                  <label>                    <input type="radio" name="payment" value="cash">                    Cash on the door (sorry, no EFT-POS!)                  </label>                </div>              </div>            </div>            <div class="form-group">              <label class="col-sm-4 control-label">Other comments</label>              <div class="col-sm-8">                <textarea name="comments" class="form-control" rows="3"></textarea>              </div>            </div>          </form>          <div class="loading-overlay" style="display: none;"><h4>Processing booking…</h4></div>        </div>        <div class="modal-footer">          <button type="button" class="btn btn-default" rel="cancel" data-dismiss="modal">Cancel</button>          <button type="button" class="btn btn-success" rel="submit" disabled>Submit booking</button>        </div>      </div>    </div>    ',s.successTemplate="    <h3>Thanks for booking!</h3>    <p>Your booking number is <strong>{{id}}</strong>.</p>    {{#internetBanking}}    <p>Please use this number as a reference when making your payment of <strong>{{total}}</strong>. Our account details are:</p>    <blockquote>      <p>        Canterbury Children’s Theatre Inc<br>        03-1594-0586102-00      <p>    </blockquote>    {{/internetBanking}}    {{^internetBanking}}    <p>Please bring <strong>{{total}}</strong> cash (or a cheque made out to Canterbury Children’s Theatre, Inc) to the performance with you. <strong>Sorry, we are unable to accept EFT-POS or credit cards at the theatre.</strong></p>    {{/internetBanking}}    {{#email}}    <p>We’ve emailed you a copy of this booking for your records, but you don’t need to bring it with you on the day.</p>    {{/email}}    <p>We’ll see you on <strong>{{date}}</strong>! The show starts at <strong>{{time}}</strong>, but please arrive around 15–20 minutes early.</p>    ",s.prototype.elements={form:"form",".modal-content":"dialog","[rel=shows] .current":"currentShow","[rel=shows] .dropdown-menu":"showMenu","[rel=performances] .current":"currentPerformance","[rel=performances] .dropdown-menu":"performanceMenu","[name=tickets]":"numberOfTickets",".loading-overlay":"overlay"},s.prototype.events={"mousedown [rel=minus], [rel=plus]":"startCount","tick [rel=minus]":"minus","tick [rel=plus]":"plus","click .dropdown-menu [data-value]":"dropdownChanged","change [name=show_id]":"updateDates","click [rel=submit]":"submit","submit form":"submit","keypress :input":"keypress"},s.url="/bookings",s.prototype.init=function(){return this.el.addClass("booking modal fade").on("shown.bs.modal",this.shown).on("hidden.bs.modal",this.hidden),this.append($("<div>",{"class":"modal-content"})),this.dialog.wrap('<div class="modal-dialog">'),this.render(),Booking.bind("ajaxSuccess",this.success).bind("ajaxError",this.error)},s.prototype.shown=function(){return this.$("[name=name]").focus()},s.prototype.hidden=function(){return this.immediately(this.release)},s.prototype.day=function(t){return t||(t=new Date),new Date(t.getFullYear(),t.getMonth(),t.getDate(),4,0)},s.prototype.isInFuture=function(t){return this.day(t)>this.day()},s.prototype.formatDate=function(t,e){var o;return null==e&&(e=!0),o=new Date(Date.parseDB(t)),{date:o.db(),label:o.label(),open:e&&this.isInFuture(o)}},s.prototype.formatDates=function(t){var e,n,r;r=[];for(e in t)o.call(t,e)&&(n=t[e],r.push(this.formatDate(e,n)));return r},s.prototype.render=function(){var t;return t=this.booking.show(),this.html(Milk.render(this.constructor.template,{show:t.title(),shows:function(){var e,o,n,r;for(n=Show.all(),r=[],e=0,o=n.length;o>e;e++)t=n[e],t.visible()&&r.push({id:t.id,title:t.title()});return r}()})),this.$("[name=show_id]").val(t.id),this.updateDates()},s.prototype.show=function(){return this.el.modal("show")},s.prototype.hide=function(){return this.el.modal("hide")},s.prototype.changeNumberOfTickets=function(t,e){var o,n;return null==e&&(e=1),o=$(t.target).closest(".input-group").find("input"),n=parseInt(o.val(),10),isNaN(n)&&(n=1),o.val(Math.max(n+e,1)).trigger("change"),this.updatePrices()},s.prototype.startCount=function(t){var e,o,n=this;return t.preventDefault(),e=$(t.target).trigger("tick"),o=this.after(500,function(){var t;return t=n.every(100,function(){return e.trigger("tick")}),$(window).one("mouseup",function(){return clearInterval(t)})}),$(window).one("mouseup",function(){return clearTimeout(o)})},s.prototype.minus=function(t){return this.changeNumberOfTickets(t,-1)},s.prototype.plus=function(t){return this.changeNumberOfTickets(t,1)},s.prototype.dropdownChanged=function(t){var e,o,n,r;return t.preventDefault(),r=$(t.target).closest("a"),e=r.closest(".form-group").find("input"),o=r.attr("data-value"),n=e.val(),o!==n?(r.closest(".form-group").find(".current").html(r.html()),e.val(o).trigger("change")):void 0},s.prototype.updateDates=function(){var t,e,o,n,r,s;for(this.booking.show_id(this.$("[name=show_id]").val()),this.currentShow.text(this.booking.show().title()),this.$(".show-note").remove(),null!=this.booking.show().note&&$("<div>",{"class":"alert alert-info show-note",html:this.booking.show().note}).prependTo(this.form),e=this.formatDates(this.booking.show().dates()),o=function(){var o,n,r;for(r=[],o=0,n=e.length;n>o;o++)t=e[o],t.open&&r.push(t);return r}()[0],o?(this.$("[name=date]").val(o.date),this.currentPerformance.html(o.label),this.$("[rel=submit]").removeProp("disabled")):this.currentPerformance.html("SOLD OUT!"),this.performanceMenu.empty(),s=[],n=0,r=e.length;r>n;n++)t=e[n],s.push($('<a href="#">').html(t.label).attr("data-value",t.date).prop("disabled",!t.open).toggleClass("disabled",!t.open).appendTo(this.performanceMenu).wrap("<li>"));return s},s.prototype.updatePrices=function(){var t;return t=parseInt(this.numberOfTickets.val(),10),isNaN(t)&&(t=1),this.$(".ticket-price").text(this.booking.show().price().dollars()),this.$(".total-price").text((t*this.booking.show().price()).dollars())},s.prototype.submit=function(){var t,e,n,r,s;if(t=Booking.fromForm(this.form),this.$(".alert-danger").remove(),this.$(".has-error").removeClass("has-error").find(".help-block").remove().end(),e=t.validate()){s=[];for(n in e)o.call(e,n)&&(r=e[n],this.$("[name="+n+"]").closest(".form-group").addClass("has-error").find("label").next("div").append($('<div class="help-block">').html(r)),s.push(this.$(".has-errors input").first().focus()));return s}return this.overlay.fadeIn(),t.save()},s.prototype.success=function(t){return this.form.replaceWith(this.bookingSuccessMessage(t)),this.$(".modal-footer [rel=submit]").remove(),this.$(".modal-footer [rel=cancel]").html("OK"),this.overlay.fadeOut()},s.prototype.bookingSuccessMessage=function(t){var e;return e=$.extend({},t.toJSON(),{internetBanking:"internet"===t.payment(),total:t.total().dollars(),date:t.date().date(),time:t.date().time()}),Milk.render(this.constructor.successTemplate,e)},s.prototype.error=function(){return this.overlay.fadeOut(),$("<div>").addClass("alert alert-danger").html("<strong>Sorry!</strong> There was a problem processing your booking. Please check your details and try again, or call us now on <strong>0800 BOOKINGS</strong>").prependTo(this.form)},s.prototype.keypress=function(t){return 13===t.which?this.submit():void 0},s}(Spine.Controller)}.call(this),function(){$(function(){var t,e,o,n,r,s;return Show.fetch().done(function(){return $("body").on("click","a[rel=book]",function(t){var e,o;return t.preventDefault(),e=new Booking({show_id:$(t.target).attr("data-show")}),o=new BookingForm({booking:e}),o.show()})}),s=$("#home .navigation").clone().addClass("top-navigation").appendTo("body").find("nav").attr("id","top-navigation").end().hide(),n=$("#home .navigation").offset().top,$(window).on("scroll",function(){var t,e,o;return t=$(this).height()/2,o=$(this).scrollTop(),e=Math.max((t-o)/t,0),$(".costumes-website").toggle(e>0).css({opacity:e}),s.toggle(o>=n)}).on("resize",function(){var t,e,o;return e=$("#home .navigation").offset().top,$(this).trigger("scroll"),o=$("#shows .timeline .year"),t=($("#shows").outerWidth()-$("#shows .container").width())/2,$("#shows .timeline-inner").width(o.length*o.first().outerWidth()).css("margin","0 "+t+"px")}).trigger("resize"),$("nav a, a[rel=top]").smoothScroll(),$("body").scrollspy({target:"#top-navigation",offset:150}),google.maps.visualRefresh=!0,r=new google.maps.LatLng(-43.56097359999957,172.6365446378158),e=new google.maps.Map($("#contact .map .canvas")[0],{mapTypeId:google.maps.MapTypeId.ROADMAP,center:r,zoom:15,styles:[{featureType:"water",elementType:"geometry.fill",stylers:[{color:"#00aeef"}]},{featureType:"road",elementType:"geometry.stroke",stylers:[{visibility:"off"}]},{featureType:"administrative.land_parcel",stylers:[{visibility:"off"}]},{featureType:"poi",elementType:"geometry.fill",stylers:[{color:"#8dc63f"}]},{featureType:"poi",elementType:"geometry.stroke",stylers:[{visibility:"off"}]}]}),t={url:"/assets/img/"+(window.devicePixelRatio>1?"marker@2x":"marker")+".png",scaledSize:new google.maps.Size(30,42),origin:new google.maps.Point(0,0),anchor:new google.maps.Point(15,21)},o=new google.maps.Marker({position:r,map:e,animation:google.maps.Animation.DROP,icon:t})})}.call(this);
;