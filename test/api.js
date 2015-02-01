var Ambitus = require('../');
var expect = require('unexpected');

describe('API', function () {
    beforeEach(function () {
        this.ambitus = new Ambitus({
            interval: 'week'
        });

        this.ambitus.go('2000-01-01');
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
});
