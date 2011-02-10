/*
 * simple time ago like facebook.
 * Copyright (c) Kazuhiro Osawa
 * licensed under the MIT.
 */
/*
 * usgae
 *
 * var string = simpleTimeago(epoch_time[, format_name]) // format_name: default is 'en'
 *
 * setSimpleTimeagoFormat(format_name, format_obj);
 *
 * var obj = getSimpleTimeagoFormat (format_name);
 *
 */
(function(window) {
	var formats = {};

	window.setSimpleTimeagoFormat = function(name, obj) {
		formats[name] = obj;
	};

	window.getSimpleTimeagoFormat = function(name) {
		return formats[name];
	};

	function toText(tmpl, conf, durations, date) {
		var callee = conf[tmpl];
		if (callee === undefined) {
			return date.toGMTString();
		}
		if (typeof callee === "function") {
			return callee(conf, durations, date);
		} else {
			return callee;
		}
	}
	
	window.simpleTimeago = function(epoch, format) {
		if (format === undefined) {
			format = "en";
		}
		var now     = Math.ceil(new Date().getTime() / 1000);
		var seconds = now - epoch;
		var minutes = Math.ceil(seconds / 60);
		var hours   = Math.ceil(minutes / 60);
		var days    = Math.ceil(hours / 24);
		var years   = Math.ceil(days / 365);
		var date = new Date();
		date.setTime(epoch * 1000);

		var durations = {
			seconds: seconds,
			minutes: minutes,
			hours: hours,
			days: days,
			years: years
		};

		var conf = window.getSimpleTimeagoFormat(format) || {};

		var str =
			seconds < 60 && toText("seconds", conf, durations, date) ||
			minutes < 60 && toText("minutes", conf, durations, date) ||
			hours < 24 && toText("hours", conf, durations, date) ||
			days < 7 && toText("weeks", conf, durations, date) ||
			days < 30 && toText("days", conf, durations, date) ||
			days < 365 && toText("months", conf, durations, date) ||
			toText("years", conf, durations, date);

		return str;
	};

	// add en
	(function(fmt) {
		var o = {};

		o.getTime = function(date) {
			var hour = date.getHours();
			if (hour === 0) {
				hour = 24;
			}
			var minutes = date.getMinutes();
			if (minutes < 10) {
				minutes = "0" + minutes;
			}
			if (hour < 13) {
				return hour + ":" + minutes + "am";
			} else {
				return (hour - 12) + ":" + minutes + "pm";
			}
		};

		o.monthNames = [
			"January", "February", "March",
			"April", "May", "June",
			"July", "August", "September",
			"October", "November", "December"
		];
		o.getDate = function(date) {
			return o.monthNames[date.getMonth()] + " " + date.getDate();
		};

		o.seconds = function(c, d, date) {
			if (d.seconds < 5) {
				return "just now";
			} else if (d.seconds < 30) {
				return "a few seconds ago";
			}
			return d.seconds + " seconds ago";
		};
		o.minutes = function(c, d, date) {
			if (d.minutes === 1) {
				return "about a minute ago";
			}
			return d.minutes + " minutes ago";
		};
		o.hours = function(c, d, date) {
			if (d.hours === 1) {
				return "about an hour ago";
			}
			return d.hours + " hours ago";
		};
		o.days = function(c, d, date) {
			var str = o.getDate(date);
			if (new Date().getFullYear() - date.getFullYear() > 0) {
				str += ", " + date.getFullYear();
			}
			return str + " at " + o.getTime(date);
		};

		o.weeks = function(c, d, date) {
			if (new Date().getDate() - date.getDate() === 1) {
				return "Yesterday at " + o.getTime(date);
			} else {
				return o.days(c, d, date);
			}
		};
		o.months = o.years = o.days;

		fmt("en", o);
	})(window.setSimpleTimeagoFormat);

	// add ja
	(function(fmt) {
		var o = {};

		o.getTime = function(date) {
			var hour = date.getHours();
			var minutes = date.getMinutes();
			if (minutes < 10) {
				minutes = "0" + minutes;
			}
			return hour + "時" + minutes + "分";
		};

		o.monthNames = [];
		o.getDate = function(date) {
			return (date.getMonth() + 1) + "月" + date.getDate() + "日";
		};

		o.seconds = function(c, d, date) {
			if (d.seconds < 5) {
				return "たった今";
			}
			return d.seconds + "秒前";
		};
		o.minutes = function(c, d, date) {
			return d.minutes + "分前";
		};
		o.hours = function(c, d, date) {
			return d.hours + "時間前";
		};
		o.days = function(c, d, date) {
			var str = o.getDate(date);
			if (new Date().getFullYear() - date.getFullYear() > 0) {
				str = date.getFullYear() + "年" + str;
			}
			return str + " " + o.getTime(date);
		};

		o.weeks = function(c, d, date) {
			if (new Date().getDate() - date.getDate() === 1) {
				return "昨日の" + o.getTime(date);
			} else {
				return o.days(c, d, date);
			}
		};
		o.months = o.years = o.days;

		fmt("ja", o);
	})(window.setSimpleTimeagoFormat);

})(window);
