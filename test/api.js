var Ambitus = require('../');
var moment = require('moment');
var sinon = require('sinon');
var expect = require('unexpected').clone();

require('moment-range');
expect.installPlugin(require('unexpected-sinon'));

var msPerDay = 24 * 60 * 60 * 1000;

describe('API', function () {
    beforeEach(function () {
        this.instance = new Ambitus({
            interval: 'week'
        });

        this.instance.go('2000-01-01');
    });

    it('should have the described methods', function () {
        expect(Ambitus.prototype, 'to only have keys', ['get', 'interval', 'next', 'previous', 'today', 'go']);

        expect(Ambitus.prototype.get, 'to have arity', 0);
        expect(Ambitus.prototype.interval, 'to have arity', 1);
        expect(Ambitus.prototype.next, 'to have arity', 0);
        expect(Ambitus.prototype.previous, 'to have arity', 0);
        expect(Ambitus.prototype.today, 'to have arity', 0);
        expect(Ambitus.prototype.go, 'to have arity', 1);
    });

    describe('#interval', function () {
        it('should return a day interval', function () {
            var result = this.instance.interval('day');

            expect(result.interval, 'to be', 'day');
            expect(result.range.diff(), 'to be', msPerDay - 1);
        });

        it('should return a week interval', function () {
            var result = this.instance.interval('week');

            expect(result.interval, 'to be', 'week');
            expect(result.range.diff(), 'to be', msPerDay * 7 - 1);
        });

        it('should return a month interval', function () {
            var result = this.instance.interval('month');

            expect(result.interval, 'to be', 'month');
            expect(result.range.diff(), 'to be', msPerDay * 31 - 1);
        });
    });

    describe('#get', function () {
        it('should return a day interval', function () {
            this.instance.interval('day');

            var result = this.instance.get();

            expect(result.interval, 'to be', 'day');
            expect(result.range.diff(), 'to be', msPerDay - 1);

            expect(result.interval, 'to be', this.instance._interval);
            expect(result.range, 'to be', this.instance.ranges.day);
        });

        it('should return a week interval', function () {
            this.instance.interval('week');

            var result = this.instance.get();

            expect(result.interval, 'to be', 'week');
            expect(result.range.diff(), 'to be', msPerDay * 7 - 1);

            expect(result.interval, 'to be', this.instance._interval);
            expect(result.range, 'to be', this.instance.ranges.week);
        });

        it('should return a month interval', function () {
            this.instance.interval('month');

            var result = this.instance.get();

            expect(result.interval, 'to be', 'month');
            expect(result.range.diff(), 'to be', msPerDay * 31 - 1);

            expect(result.interval, 'to be', this.instance._interval);
            expect(result.range, 'to be', this.instance.ranges.month);
        });
    });

    describe('event handling', function () {
        it('should call the onBeforeChange handler when changing the range', function () {
            var stub = sinon.stub();
            var instance = new Ambitus({
                interval: 'week',
                onBeforeChange: stub
            });

            var result = instance.next();

            expect(stub, 'was called');
            expect(result.range.contains(moment().add(1, 'week')), 'to be true');
        });

        it('should call the onChange handler when changing the range', function () {
            var stub = sinon.stub();
            var instance = new Ambitus({
                interval: 'week',
                onChange: stub
            });

            var result = instance.next();

            expect(stub, 'was called');
            expect(result.range.contains(moment().add(1, 'week')), 'to be true');
        });

        it('should not call the onChange handler when changing the range when onBeforeChange handler returns false', function () {
            var beforeStub = sinon.stub().returns(false);
            var stub = sinon.stub();
            var instance = new Ambitus({
                interval: 'week',
                onBeforeChange: beforeStub,
                onChange: stub
            });

            var before = instance.get();
            var result = instance.next();

            expect(beforeStub, 'was called');
            expect(stub, 'was not called');
            expect(result.range.contains(moment()), 'to be true');
            expect(result.range.isSame(before.range), 'to be true');
        });
    });
});
