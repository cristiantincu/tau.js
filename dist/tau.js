(
  function (context) {
    "use strict";

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ·.· ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

var api;
var VERSION = "0.0.1";
var ctorImpl;
var getUtcIsoStringImpl;
var pad;
var getMaxDate;
var getUtcYearImpl;
var setUtcYearImpl;
var getUtcMonthImpl;
var setUtcMonthImpl;
var getUtcDateImpl;
var setUtcDateImpl;
var getUtcHoursImpl;
var setUtcHoursImpl;
var getUtcMinutesImpl;
var setUtcMinutesImpl;
var getUtcSecondsImpl;
var setUtcSecondsImpl;
var getUtcMillisecondsImpl;
var setUtcMillisecondsImpl;
var isValidImpl;
var P_OBJECT = Object.prototype;
var prevTau;

ctorImpl =
  function () {
    this[0] = "1970-01-01T00:00:000Z";
  };

getUtcIsoStringImpl =
  function () {
    return this[0];
  };

pad =
  function (n, l) {
    var result;

    l || (l = 2);
    result = "" + n;
    while (result.length !== l) {
      result = "0" + result;
    }
    return result;
  };

getMaxDate =
  function (year, month) {
    /* January, March, May, July, August, October, or December. */
    if (
      month === 0 || month === 2 || month === 4 ||
      month === 6 || month === 7 || month === 9 ||
      month === 11
    ) {
      return 31;
    }
    /* April, June, September, or November. */
    else if (
      month === 3 || month === 5 || month === 8 ||
      month === 10
    ) {
      return 30;
    }
    /* February, leap year. */
    else if (year % 400 === 0 || year % 100 !== 0 && year % 4 === 0) {
      return 29;
    }
    /* February, common year. */
    else {
      return 28;
    }
  };

getUtcYearImpl =
  function () {
    return + this[0].slice(0, 4);
  };

setUtcYearImpl =
  function (year, silent) {
    this[0] = pad(year, 4) + this[0].slice(4);
    if (! silent && ! this.isValid()) {
      throw new Error("Invalid date.");
    }
    return this;
  };

getUtcMonthImpl =
  function () {
    return + this[0].slice(5, 7) - 1;
  };

setUtcMonthImpl =
  function (month, silent) {
    var delta = Math.floor(month / 11);
    var year = this.getUtcYear() + delta;

    this[0] = this[0].slice(0, 5) + pad(month % 11 + 1) + this[0].slice(7);
    if (! silent && ! this.isValid()) {
      throw new Error("Invalid date.");
    }
    delta && this.setUtcYear(year, silent);
    return this;
  };

getUtcDateImpl =
  function () {
    return + this[0].slice(8, 10);
  };

setUtcDateImpl =
  function (date, silent) {
    var year;
    var month;
    var maxDate;

    while (1) {
      year = this.getUtcYear();
      month = this.getUtcMonth();
      maxDate = getMaxDate(year, month);
      if (date <= maxDate) {
        this[0] = this[0].slice(0, 8) + pad(date) + this[0].slice(10);
        if (! silent && ! this.isValid()) {
          throw new Error("Invalid date.");
        }
        return this;
      }
      else {
        date -= maxDate;
        this.setUtcMonth(month + 1, silent);
      }
    }
  };

getUtcHoursImpl =
  function () {
    return + this[0].slice(11, 13);
  };

setUtcHoursImpl =
  function (hours, silent) {
    var delta = Math.floor(hours / 24);
    var date = this.getUtcDate() + delta;

    this[0] = this[0].slice(0, 11) + pad(hours % 24) + this[0].slice(13);
    if (! silent && ! this.isValid()) {
      throw new Error("Invalid date.");
    }
    delta && this.setUtcDate(date, silent);
    return this;
  };

getUtcMinutesImpl =
  function () {
    return + this[0].slice(14, 16);
  };

setUtcMinutesImpl =
  function (minutes, silent) {
    var delta = Math.floor(minutes / 60);
    var hours = this.getUtcHours() + delta;

    this[0] = this[0].slice(0, 14) + pad(minutes % 24) + this[0].slice(16);
    if (! silent && ! this.isValid()) {
      throw new Error("Invalid date.");
    }
    delta && this.setUtcHours(hours, silent);
    return this;
  };

getUtcSecondsImpl =
  function () {
    return + this[0].slice(17, 19);
  };

setUtcSecondsImpl =
  function (seconds, silent) {
    var delta = Math.floor(seconds / 60);
    var minutes = this.getUtcMinutes() + delta;

    this[0] = this[0].slice(0, 17) + pad(seconds % 24) + this[0].slice(19);
    if (! silent && ! this.isValid()) {
      throw new Error("Invalid date.");
    }
    delta && this.setUtcMinutes(minutes, silent);
    return this;
  };

getUtcMillisecondsImpl =
  function () {
    return + this[0].slice(20, 23);
  };

setUtcMillisecondsImpl =
  function (milliseconds, silent) {
    var delta = Math.floor(milliseconds / 1000);
    var seconds = this.getUtcSeconds() + delta;

    this[0] =
      this[0].slice(0, 20) + pad(milliseconds % 1000, 3) + this[0].slice(23);
    if (! silent && ! this.isValid()) {
      throw new Error("Invalid date.");
    }
    delta && this.setUtcSeconds(seconds, silent);
    return this;
  };

isValidImpl =
  function () {
    if (
      P_OBJECT.toString.call(this[0]) !== "[object String]" ||
      ! this[0].match(/(\d{4})-(\d{2})-(\d{2})T(\d{2})\:(\d{2})\:(\d{3})Z/) ||
      this[0].length !== 21
    ) {
      return false;
    }
    if (
      this.getUtcMonth() > 11 ||
      this.getUtcDate() > getMaxDate(this.getUtcYear(), this.getUtcMonth()) ||
      this.getUtcHours() > 23 ||
      this.getUtcMinutes() > 59 ||
      this.getUtcSeconds() > 59
    ) {
      return false;
    }
    return true;
  };



/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

api = ctorImpl;

api.prototype.getUtcIsoString = getUtcIsoStringImpl;
api.prototype.getUtcYear = getUtcYearImpl;
api.prototype.setUtcYear = setUtcYearImpl;
api.prototype.getUtcMonth = getUtcMonthImpl;
api.prototype.setUtcMonth = setUtcMonthImpl;
api.prototype.getUtcDate = getUtcDateImpl;
api.prototype.setUtcDate = setUtcDateImpl;
api.prototype.getUtcHours = getUtcHoursImpl;
api.prototype.setUtcHours = setUtcHoursImpl;
api.prototype.getUtcMinutes = getUtcMinutesImpl;
api.prototype.setUtcMinutes = setUtcMinutesImpl;
api.prototype.getUtcSeconds = getUtcSecondsImpl;
api.prototype.setUtcSeconds = setUtcSecondsImpl;
api.prototype.getUtcMilliseconds = getUtcMillisecondsImpl;
api.prototype.setUtcMilliseconds = setUtcMillisecondsImpl;
api.prototype.isValid = isValidImpl;

api.VERSION = VERSION;

/* Probably CommonJS. */
if (typeof exports !== "undefined") {
  /* Probably Node.js. */
  if (typeof module !== "undefined" && module.exports) {
    exports = module.exports = api;
  }
  exports["Tau"] = api;
}
/* Probably a browser. */
else {
  prevTau = context["Tau"];
  context["Tau"] = api;
  api.noConflict =
    function () {
      context["Tau"] = prevTau;
      return api;
    };
}



/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ .·. ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

  }
)(this);
