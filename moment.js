'use strict';

var weekDays = {0: 'ПН', 1: 'ВТ', 2: 'СР', 3: 'ЧТ', 4: 'ПТ', 5: 'СБ', 6: 'ВС',
    'ПН': 0, 'ВТ': 1, 'СР': 2, 'ЧТ': 3, 'ПТ': 4, 'СБ': 5, 'ВС': 6};

module.exports = function () {
    return {
        _date: null,
        timezone: null,

        get date() {
            if (this._date === null) {
                return null;
            }
            return this.timeSet(this._date);
        },
        get fullDate() {
            return this._date;
        },
        set date(item) {
            if (typeof item === 'string') {
                this._date = this.parseTime(item);
                this.timezone = this._date.timezone;
            } else {
                this._date = item;
            }
        },

        // Выводит дату в переданном формате
        format: function (pattern) {
            if (this._date !== null) {
                var dateInTimezone = changeToFormatZone(this);

                pattern = pattern.replace('%DD', dateInTimezone.date);
                pattern = pattern.replace('%HH', dateInTimezone.hour);
                pattern = pattern.replace('%MM', dateInTimezone.minute);

                return pattern;
            }
        },

        // Возвращает кол-во времени между текущей датой и переданной `moment`
        // в человекопонятном виде
        fromMoment: function (moment) {
            if (this._date !== null) {
                var result = substraction(this.fullDate, moment.fullDate);
                return '«До ограбления остался ' + result.date +
                ' день ' + result.hour + ' часов ' + result.minute + ' минут»';
            }
        },
        parseTime: function (time) {
            var re = /(.{2})\s(\d{2}):(\d{2})([\+|\-]\d{1,2})/;
            var time = time.match(re);

            var timezone = time[4].indexOf('+') === 0 ? Number(time[4].slice(1)) : Number(time[4]);
            var times = toCorrectTime(weekDays[time[1]], Number(time[2]) - timezone);

            return {date: times.date, hour: times.hour,
                minute: Number(time[3]), timezone: timezone};
        },
        timeSet: function (time) {
            return time.date * 24 * 60 + time.hour * 60 + time.minute;
        }
    };
    function substraction(a, b) {
        var minute = a.minute - b.minute;
        if (minute < 0) {
            a.hour--;
            minute = 60 + minute;
        }
        var hour = a.hour - b.hour;
        if (hour < 0) {
            if (a.date > 0) {
                a.date--;
                hour = 24 + hour;
            }
        }
        var date = a.date - b.date;

        return {date: date, hour: hour, minute: minute};
    }
    function changeToFormatZone(moment) {
        var hour = moment._date.hour + moment.timezone;
        var date = moment._date.date;
        var time = toCorrectTime(date, hour);

        hour = time.hour < 10 ? '0' + time.hour : time.hour;
        date = weekDays[time.date];
        var minute = moment._date.minute < 10 ? '0' + moment._date.minute : moment._date.minute;

        return {date: date, hour: hour, minute: minute};
    }
    function toCorrectTime(date, hour) {
        if (hour < 0) {
            hour = 24 - hour % 24;
            date--;
        }
        if (hour > 24) {
            hour = hour % 24;
            date++;
        }
        return {date: date, hour: hour};
    }
};
