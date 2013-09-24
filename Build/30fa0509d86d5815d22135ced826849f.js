!function(){String.prototype.ucfirst=function(){return this.substr(0,1).toUpperCase()+this.substr(1)},Number.prototype.pad=function(t){var e;for(null==t&&(t=2),e=this.toString();e.length<2;)e="0"+e;return e},Number.prototype.dollars=function(){var t;return t=this%100,t=0===t?"":10>t?".0"+t:"."+t,"$"+Math.floor(this/100)+t},Date.MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"],Date.DAYS=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],Date.prototype.db=function(){return""+this.getFullYear()+"-"+(this.getMonth()+1).pad()+"-"+this.getDate().pad()+" "+this.getHours().pad()+":"+this.getMinutes().pad()},Date.parseDB=function(t){var e,n;return"string"!=typeof t?t:(n=function(){var n,i,r,o;for(r=t.split(/[^\d]+/),o=[],n=0,i=r.length;i>n;n++)e=r[n],o.push(parseInt(e,10));return o}(),new Date(n[0],n[1]-1,n[2],n[3],n[4]))},Date.prototype.label=function(){return""+this.date()+", "+this.time()},Date.prototype.date=function(){return""+Date.DAYS[this.getDay()]+", "+this.getDate()+" "+Date.MONTHS[this.getMonth()]},Date.prototype.time=function(){return""+((this.getHours()-1)%12+1)+":"+this.getMinutes().pad()+(this.getHours()<12?"am":"pm")},"undefined"!=typeof Spine&&null!==Spine&&(Spine.Controller.prototype.after=function(t,e){return setTimeout(e,t)},Spine.Controller.prototype.immediately=function(t){return this.after(0,t)},Spine.Controller.prototype.every=function(t,e){return setInterval(e,t)})}.call(this),function(){var t,e,n={}.hasOwnProperty,i=function(t,e){function i(){this.constructor=t}for(var r in e)n.call(e,r)&&(t[r]=e[r]);return i.prototype=e.prototype,t.prototype=new i,t.__super__=e.prototype,t};window.Venue=function(e){function n(){return t=n.__super__.constructor.apply(this,arguments)}return i(n,e),n.configure("Venue","name","address","phone","geo","capacity"),n.prototype.capacity=function(t){return null!=t&&(this._capacity=parseInt(t,10)),this._capacity},n}(Spine.Model),window.Show=function(t){function r(){return e=r.__super__.constructor.apply(this,arguments)}return i(r,t),r.configure("Show","title","byline","dates","venue","price"),r.prototype.title=function(t){return null!=t&&(this._title=t),this._title},r.prototype.byline=function(t){return null!=t&&(this._byline=t),this._byline},r.prototype.dates=function(t){return null!=t&&(this._parsedDates=void 0,this._dates=$.extend({},t)),this._dates||{}},r.prototype.parsedDates=function(){var t,e,i;if(null==this._parsedDates){this._parsedDates=[],i=this.dates();for(t in i)n.call(i,t)&&(e=i[t],this._parsedDates.push(new Date(Date.parseDB(t))));this._parsedDates.sort(function(t,e){return t=t.getTime(),e=e.getTime(),e>t?-1:t>e?1:0}),console.log(this._parsedDates)}return this._parsedDates},r.prototype.price=function(t){return null!=t&&(this._price=parseInt(t,10)),this._price},r.prototype.venue=function(t){return null!=t&&(this._venue_id=t.id||t),Venue.find(this._venue_id)},r.fetch=function(){return $.getJSON("/shows").done(function(t){return Venue.refresh(t.venues),r.refresh(t.shows)})},r}(Spine.Model)}.call(this),function(){var t,e={}.hasOwnProperty,n=function(t,n){function i(){this.constructor=t}for(var r in n)e.call(n,r)&&(t[r]=n[r]);return i.prototype=n.prototype,t.prototype=new i,t.__super__=n.prototype,t};window.Booking=function(i){function r(){return t=r.__super__.constructor.apply(this,arguments)}return n(r,i),r.configure("Booking","show_id","date","tickets","name","email","phone","payment","paid","amount","comments"),r.extend(Spine.Model.Ajax),r.EMAIL=/^[^\s@]+@[^\s@]+\.[^\s@]+$/,r.prototype.show_id=function(t){return null!=t&&(this._show_id=t),this._show_id},r.prototype.name=function(t){return null!=t&&(this._name=t),this._name},r.prototype.email=function(t){return null!=t&&(this._email=t),this._email},r.prototype.phone=function(t){return null!=t&&(this._phone=t),this._phone},r.prototype.payment=function(t){return null!=t&&(this._payment=t),this._payment},r.prototype.paid=function(t){return null!=t&&(this._paid=!!t),this._paid},r.prototype.date=function(t){return t&&(this._date=new Date(Date.parseDB(t))),this._date},r.prototype.tickets=function(t){return null!=t&&(this._tickets=parseInt(t,10)),this._tickets},r.prototype.amount=function(t){return null!=t&&(this._amount=parseInt(t,10)),this._amount},r.prototype.show=function(){return Show.find(this.show_id())},r.prototype.validate=function(){var t,n;t={},this.show_id()||(t.show_id="Please select a show"),this.date()&&this._date.getTime&&!isNaN(this._date.getTime())||(t.date="Please select a performance"),this.name()||(t.name="Please fill in your name"),this.email()||this.phone()||(t.email="Please fill in your email address or phone number"),this.email()&&!this.email().match(this.constructor.EMAIL)&&(t.email="Please check your email address"),(isNaN(this.tickets())||this.tickets()<1)&&(t.tickets="Please select a number of tickets");for(n in t)if(e.call(t,n))return t},r.prototype.total=function(t){var e;return null!=t&&(this._total=t),null!=(e=this._total)?e:this.show().price()*this.tickets()},r.prototype.toJSON=function(){var t,e;return t=r.__super__.toJSON.apply(this,arguments),$.extend({},t,{date:null!=(e=this.date())?e.db():void 0})},r.fetchSummary=function(){var t;return t=$.Deferred(),$.getJSON("/bookings").done(function(e){return Show.refresh(e.shows),t.resolve()}),t},r.partition=function(){return this.all().reduce(function(t,e){var n;return(null!=t[n=e.date().db()]?t[n=e.date().db()]:t[n]=[]).push(e)&&t},{})},r}(Spine.Model)}.call(this),function(){var t,e,n=function(t,e){return function(){return t.apply(e,arguments)}},i={}.hasOwnProperty,r=function(t,e){function n(){this.constructor=t}for(var r in e)i.call(e,r)&&(t[r]=e[r]);return n.prototype=e.prototype,t.prototype=new n,t.__super__=e.prototype,t};t=function(t){function o(){return this.updateHeader=n(this.updateHeader,this),this.update=n(this.update,this),this.renderBooking=n(this.renderBooking,this),this.renderBookings=n(this.renderBookings,this),this.render=n(this.render,this),e=o.__super__.constructor.apply(this,arguments)}return r(o,t),o.SECTION='    <section class="performance">      <a href="#bookings-{{id}}" data-toggle="collapse"><span class="glyphicon glyphicon-play"></span></a>      <header>        <div class="row">          <div class="col-xs-12"><h2></h2></div>        </div>        <div class="row">          <div class="col-xs-9">            <div class="progress">              <div class="progress-bar progress-bar-danger" style="width: 0%;" rel="unpaid"></div>              <div class="progress-bar progress-bar-success" style="width: 0%;" rel="paid"></div>            </div>          </div>          <div class="stat col-xs-1" rel="unpaid"></div>          <div class="stat col-xs-1" rel="paid"></div>          <div class="stat col-xs-1" rel="total"></div>        </div>      </header>      <div class="collapse bookings" id="bookings-{{id}}">      </div>    </section>  ',o.BOOKING='    <div class="row booking" data-reference="{{id}">      <div class="col-xs-3">        <div class="reference">{{id}}</div>        <div class="name">{{name}}</div>      </div>      <div class="col-xs-3">        {{#email}}<a class="email" href="mailto:{{email}}">{{email}}</a>{{/email}}        <div class="phone">{{phone}}</div>      </div>      <div class="col-xs-1">        <div class="payment">{{payment}}</div>        <div class="amount">{{amount}}</div>      </div>      <div class="col-xs-2"><button class="btn btn-default btn-block">Unpaid</button></div>      <div class="stat col-xs-1" rel="unpaid">{{unpaid}}</div>      <div class="stat col-xs-1" rel="paid">{{paid}}</div>      <div class="stat col-xs-1" rel="total">{{total}}</div>      {{#comments}}      <div class="col-xs-12 comments"><p>{{comments}}</p></div>      {{/comments}}    </div>  ',o.prototype.events={"show.bs.collapse .bookings":"open","hide.bs.collapse .bookings":"collapse","click .booking .btn":"togglePayment"},o.prototype.init=function(){return Show.bind("refresh",this.render),Booking.bind("refresh",this.renderBookings).bind("update",this.update),$.getJSON(window.location.pathname+"?_="+(new Date).getTime()).done(function(t){return Venue.refresh(t.venues),Show.refresh(t.show),Booking.refresh(t.bookings)})},o.prototype.render=function(t){var e,n,i,r,o,s,a;for(this.show=("function"==typeof t.shift?t.shift():void 0)||t,$("h1").html("Bookings for <strong>"+this.show.title()+"</strong>"),s=this.show.parsedDates(),a=[],r=0,o=s.length;o>r;r++)e=s[r],n=e.db().replace(/[^\d]+/g,"-"),a.push(i=$(Milk.render(this.constructor.SECTION,{id:n})).appendTo(this.el).attr("data-date",e.db()).find("h2").text(e.label()).end());return a},o.prototype.renderBookings=function(t){var e,n,r,o,s,a;this.updateHeader(this.$(".total"),t,this.show.dates().length*this.show.venue().capacity()),s=Booking.partition(),a=[];for(n in s)i.call(s,n)&&(r=s[n],o=$("section[data-date='"+n+"']"),this.updateHeader(o,r,this.show.venue().capacity()),a.push(function(){var t,n,i;for(i=[],t=0,n=r.length;n>t;t++)e=r[t],i.push(o.find(".bookings").append(this.renderBooking(e)));return i}.call(this)));return a},o.prototype.renderBooking=function(t){var e,n;return e=$.extend({},t.toJSON(),{payment:t.payment().ucfirst(),unpaid:t.paid()?"":t.tickets(),paid:t.paid()?t.tickets():"",total:t.tickets(),amount:t.amount().dollars()}),n=$(Milk.render(this.constructor.BOOKING,e)),n.attr("data-reference",t.id),t.paid()&&n.addClass("paid").find(".btn").addClass("btn-success").text("Paid").end(),n},o.prototype.update=function(t){var e;return this.$("[data-reference='"+t.id+"']").replaceWith(this.renderBooking(t)),this.updateHeader(this.$("[data-date='"+t.date().db()+"']"),function(){var n,i,r,o;for(r=Booking.all(),o=[],n=0,i=r.length;i>n;n++)e=r[n],e.date().getTime()===t.date().getTime()&&o.push(e);return o}(),this.show.venue().capacity()),this.updateHeader(this.$(".total"),Booking.all(),this.show.dates().length*this.show.venue().capacity())},o.prototype.updateHeader=function(t,e,n){var r,o,s,a,p,u,l;for(s={unpaid:0,paid:0,total:0},p=0,u=e.length;u>p;p++)r=e[p],s.unpaid+=+!r.paid()*r.tickets(),s.paid+=+r.paid()*r.tickets(),s.total+=r.tickets();l=[];for(o in s)i.call(s,o)&&(a=s[o],$("header .stat[rel="+o+"]",t).html(a||"&nbsp;"),l.push($("header .progress-bar[rel="+o+"]",t).animate({width:""+100*a/n+"%"})));return l},o.prototype.open=function(t){return $(t.target).closest(".performance").addClass("open")},o.prototype.collapse=function(t){return $(t.target).closest(".performance").removeClass("open")},o.prototype.bookingFromElement=function(t){return Booking.exists($(t).closest(".booking").attr("data-reference"))},o.prototype.togglePayment=function(t){var e;return(e=this.bookingFromElement(t.target))?e.updateAttributes({paid:!e.paid()}):void 0},o}(Spine.Controller),$(function(){return new t({el:".container"})})}.call(this);
;