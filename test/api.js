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
        expect(Ambitus.prototype, 'to have keys', ['get', 'interval', 'next', 'previous', 'today', 'go']);
    });
});
