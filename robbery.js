'use strict';

var moment = require('./moment');

// Выбирает подходящий ближайший момент начала ограбления
module.exports.getAppropriateMoment = function (json, minDuration, workingHours) {
    var appropriateMoment = moment();
    var robbers = JSON.parse(json);

    var workTime = [];
    for (var item in robbers) {
        robbers[item].forEach(function (item, i, robbers) {
            workTime.push({from: appropriateMoment.parseTime(item.from),
                to: appropriateMoment.parseTime(item.to)});
        });
    }

    workTime.sort(function (a, b) {
        return appropriateMoment.timeSet(a.from) > appropriateMoment.timeSet(b.from) ? 1 : -1;
    });
    minDuration = minDuration;

    var workingTimeFrom = appropriateMoment.parseTime('ПН ' + workingHours.from);
    var workingTimeTo = appropriateMoment.parseTime('ПН ' + workingHours.to);

    workingTimeFrom.date--;
    workingTimeTo.date--;

    var i = 0;
    for (var weekDay = 0; weekDay < 6; weekDay++) {
        workingTimeFrom.date++;
        workingTimeTo.date++;

        var minTime = workingTimeFrom;

        for (; i < workTime.length; i++) {
            if (appropriateMoment.timeSet(workTime[i].to) >
                    appropriateMoment.timeSet(workingTimeTo)) {
                break;
            }
            if (appropriateMoment.timeSet(workTime[i].from) -
                    appropriateMoment.timeSet(minTime) > minDuration) {
                appropriateMoment.date = minTime;
                appropriateMoment.timezone = minTime.timezone;
                break;
            } else {
                minTime = appropriateMoment.timeSet(minTime) >
                    appropriateMoment.timeSet(workTime[i].to) ?
                    minTime : workTime[i].to;
            }
        }
        if (appropriateMoment.date !== null) {
            break;
        }
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
