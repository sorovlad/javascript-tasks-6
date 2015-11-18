'use strict';

var moment = require('./moment');

// Выбирает подходящий ближайший момент начала ограбления
module.exports.getAppropriateMoment = function (json, minDuration, workingHours) {
    var appropriateMoment = moment();
    var robbers = JSON.parse(json);

    var workTime = [];
    for (var item in robbers) {
        robbers[item].forEach(function (item, i, robbers) {
            var timeFrom = appropriateMoment.parseTime(item.from);
            var timeTo = appropriateMoment.parseTime(item.to);
            if (timeFrom <= timeTo) {
                workTime.push({from: timeFrom, to: timeTo});
            }
        });
    }

    workTime.sort(function (a, b) {
        return appropriateMoment.getMinutes(a.from) >
            appropriateMoment.getMinutes(b.from) ? 1 : -1;
    });

    var workingTimeFrom = appropriateMoment.parseTime('ПН ' + workingHours.from);
    var workingTimeTo = appropriateMoment.parseTime('ПН ' + workingHours.to);

    var i = 0;
    for (var weekDay = 0; weekDay < 2; weekDay++) {
        var minTime = workingTimeFrom;

        for (; i < workTime.length; i++) {
            if (appropriateMoment.getMinutes(workTime[i].to) >
                    appropriateMoment.getMinutes(workingTimeTo)) {
                break;
            }
            if (appropriateMoment.getMinutes(workTime[i].from) -
                    appropriateMoment.getMinutes(minTime) > minDuration) {
                appropriateMoment.date = minTime;
                appropriateMoment.timezone = minTime.timezone;
                break;
            } else {
                minTime = appropriateMoment.getMinutes(minTime) >
                    appropriateMoment.getMinutes(workTime[i].to) ?
                    minTime : workTime[i].to;
            }
        }
        if (appropriateMoment.date !== null) {
            break;
        }
        workingTimeFrom.date++;
        workingTimeTo.date++;
    }

    return appropriateMoment;
};

// Возвращает статус ограбления (этот метод уже готов!)
module.exports.getStatus = function (moment, robberyMoment) {
    if (moment.date < robberyMoment.date) {
        // «До ограбления остался 1 день 6 часов 59 минут»
        return robberyMoment.fromMoment(moment);
    }

    return 'Ограбление уже идёт!';
};
