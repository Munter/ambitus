/*global define*/
(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory(require('moment'), require('moment-range'));
    } else if (typeof define === 'function' && define.amd) {
        define(['moment', 'moment-range'], factory);
    } else {
        factory(root.moment);
    }
}(this, function (moment) {
    var intervals = ['day', 'week', 'month'],
        change = function (self, start, end, interval) {
            var config = self.config,
                onbeforeChange = config.onBeforeChange,
                onChange = config.onChange,
                current = self.get(),
                potential = {
                    interval: interval || self._interval,
                    range: moment().range(start, end)
                };

            if (typeof onbeforeChange === 'function' && onbeforeChange(potential, current) === false) {
                return current;
            }

            self._interval = potential.interval;
            self.ranges[self._interval] = potential.range;

            if (typeof onChange === 'function') {
                onChange(potential, current);
            }

            return potential;
        };

    function Ambitus(config) {
        var self = this;

        self.config = config || {};

        self.m = config.moment || moment;
        self._interval = self.config.interval || 'month';

        self.ranges = {};
        intervals.forEach(function (interval) {
            self.ranges[interval] = self.m().range(self.m().startOf(interval), self.m().endOf(interval));
        });

        self.go(self.m(self.config.date), self._interval);
    }

    Ambitus.prototype = {
        interval: function (interval) {
            var self = this,
                today = self.m(),
                oldRange = self.ranges[self._interval],
                potentialRange = self.ranges[interval],
                start,
                end;

            if (!potentialRange) {
                return self.get();
            }

            if (interval === self._interval) {
                return self.get();
            }

            if (!self.config.ignoreToday && oldRange.contains(today)) {
                start = self.m(today).startOf(interval);
                end = self.m(today).endOf(interval);
            } else if (oldRange.contains(potentialRange.start) || oldRange.contains(potentialRange.end)) {
                start = self.m(potentialRange.start);
                end = self.m(potentialRange.end);
            } else {
                start = self.m(oldRange.start).startOf(interval);
                end = self.m(oldRange.start).endOf(interval);
            }

            return change(self, start, end, interval);
        },

        next: function () {
            var self = this,
                value = self.get(),
                start = self.m(value.range.end).add(1, 'ms'),
                end = self.m(start).endOf(value.interval);

            return change(self, start, end);
        },

        previous: function () {
            var self = this,
                value = self.get(),
                end = self.m(value.range.start).add(-1, 'ms'),
                start = self.m(end).startOf(value.interval);

            return change(self, start, end);
        },

        today: function () {
            var self = this;
            var interval = self._interval;

            return change(self, self.m().startOf(interval), self.m().endOf(interval));
        },

        go: function (date, interval) {
            var self = this;
            interval = interval || self._interval;

            return change(self, self.m(date).startOf(interval), self.m(date).endOf(interval));
        },

        get: function () {
            var self = this;
            var interval = self._interval;
            return {
                interval: interval,
                range: self.ranges[interval]
            };
        }
    };

    return Ambitus;
}));
