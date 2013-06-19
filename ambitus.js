define([
    'moment',
    'moment-range'
], function (moment) {
    var intervals = ['day', 'week', 'month'];

    function Ambitus(config) {
        var self = this,
            range;

        self.config = config || {};

        // config.ignoreToday
        // config.weekStart
        // config.utc
        // config.callback

        self._interval = self.config.interval || 'month';

        self.ranges = {};

        intervals.forEach(function (interval) {
            self.ranges[interval] = moment().range(moment().startOf(interval), moment().endOf(interval));
        });

        range = self.ranges[self._interval];

        self._change(range.start, range.end);
    }

    Ambitus.prototype = {
        interval: function (interval) {
            var self = this,
                today = moment(),
                oldRange = self.ranges[self._interval],
                potentialRange = self.ranges[interval],
                start,
                end;

            if (intervals.indexOf(interval) < 0) {
                return false;
            }

            if (interval === self._interval) {
                return self.ranges[interval];
            }

            if (!self.config.ignoreToday && oldRange.contains(today)) {
                start = moment(today).startOf(interval);
                end = moment(today).endOf(interval);
            } else if (oldRange.contains(potentialRange.start) || oldRange.contains(potentialRange.end)) {
                start = moment(potentialRange.start);
                end = moment(potentialRange.end);
            } else {
                start = moment(oldRange.start).startOf(interval);
                end = moment(oldRange.start).endOf(interval);
            }

            return self._change(start, end, interval);
        },

        next: function () {
            var self = this,
                interval = self._interval,
                start = self.ranges[interval].start,
                end = self.ranges[interval].end;

            start = moment(end).add(1, 'milliseconds');
            end = moment(start).endOf(interval);

            return self._change(start, end);
        },

        previous: function () {
            var self = this,
                interval = self._interval,
                start = self.ranges[interval].start,
                end = self.ranges[interval].end;

            end = moment(start).subtract(1, 'milliseconds');
            start = moment(end).startOf(interval);

            return self._change(start, end);
        },

        _change: function (start, end, interval) {
            var self = this,
                current = {
                    interval: self._interval,
                    range: self.ranges[self._interval]
                },
                potential = {
                    interval: interval || self._interval,
                    range: moment().range(start, end)
                };

            if (typeof self.config.onBeforeChange === 'function' && !self.config.beforeChange(potential, current)) {
                return false;
            }

            self._interval = potential.interval;
            self.ranges[self._interval] = potential.range;

            if (typeof self.config.onChange === 'function') {
                self.config.onChange(potential, current);
            }

            return potential.range;
        }
    };

    return Ambitus;
});
