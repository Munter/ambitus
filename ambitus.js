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
        var self = this,
            range;

        self.config = config || {};

        // config.weekStart
        // config.utc

        self._interval = self.config.interval || 'month';

        self.ranges = {};

        intervals.forEach(function (interval) {
            self.ranges[interval] = moment().range(moment().startOf(interval), moment().endOf(interval));
        });

        range = self.ranges[self._interval];

        change(self, range.start, range.end);
    }

    Ambitus.prototype = {
        interval: function (interval) {
            var self = this,
                today = moment(),
                oldRange = self.ranges[self._interval],
                potentialRange = self.ranges[interval],
                start,
                end;

            if (!potentialRange) {
                return self.get();
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

            return change(self, start, end, interval);
        },

        next: function () {
            var self = this,
                value = self.get(),
                start = moment(value.range.end).add(1, 'ms'),
                end = moment(start).endOf(value.interval);

            return change(self, start, end);
        },

        previous: function () {
            var self = this,
                value = self.get(),
                end = moment(value.range.start).add(-1, 'ms'),
                start = moment(end).startOf(value.interval);

            return change(self, start, end);
        },

        today: function () {
            var interval = this._interval;

            return change(this, moment().startOf(interval), moment().endOf(interval));
        },

        go: function (date) {
            var interval = this._interval;

            return change(this, moment(date).startOf(interval), moment(date).endOf(interval));
        },

        get: function () {
            var interval = this._interval;
            return {
                interval: interval,
                range: this.ranges[interval]
            };
        }
    };

    return Ambitus;
}));
