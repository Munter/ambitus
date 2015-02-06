Ambitus
=======

[![NPM version](https://badge.fury.io/js/ambitus.svg)](http://badge.fury.io/js/ambitus)
[![Build Status](https://travis-ci.org/Munter/ambitus.svg?branch=master)](https://travis-ci.org/Munter/ambitus)
[![Coverage Status](https://img.shields.io/coveralls/Munter/ambitus.svg?style=flat)](https://coveralls.io/r/Munter/ambitus?branch=master)
[![Dependency Status](https://david-dm.org/Munter/ambitus.svg)](https://david-dm.org/Munter/ambitus)

A stateful calendar control module providing intuitive range switching and navigation.

Ambitus can be used to control standard calendar UIs that expose day/week/month views with functions to navigate to the next and previous range and to return to today.

The aim is to provide a user experience that shows the expected range, no matter what date interval size the user navigates or switches to. When switching from a bigger interval to a smaller one, the first day of the bigger is chosen and the wanted range that includes it is returned. When switching from a smaller to a bigger range Ambitus tries to return to the previous selected one if there is a range overlap with the smaller one. The concept of 'today' is given special significance when switching interval size.

All dates returned by Ambitus are instances of [moment](http://momentjs.com/).

All date ranges returned by Ambitus are instances of [moment-range](https://github.com/gf3/moment-range).

This gives you a very rich tool chain to work with the resulting ranges and dates.


Configuration
-------------

``` javascript
new Ambitus({
    // Give special significance to today
    ignoreToday: false,

    // Initial interval string
    interval: 'month', // ['day', 'week', 'month']

    // Custom moment getter
    moment: function (input) {
        return moment(input).utc().locale('da');
    },

    // Callback that is fired before the internal state changes
    // Return false to block the change
    onBeforeChange: function (newState, oldState) {},

    // Callback that is fired when the internal state changes
    onChange: function (newState, oldState) {}
});
```


Methods
-----

**`Amitus.get()`**: Returns the current value

**`Amitus.interval(intervalString)`**: Switches the interval. `intervalString` may be `'day'`, `'week'` or `'month'`

**`Amitus.next()`**: Switch to the next range.

**`Amitus.previous()`**: Switch to the previous range.

**`Amitus.today()`**: Jump directly to the range that contains todays date.

**`Amitus.go(date)`**: Jump directly to an range including `date`. `date` may be any moment parseable value.

All methods return the same state object that get passed into the `onBeforeChange` and `onChange` event handlers:

```javascript
{
    interval: 'week', // Possible values: ['day', 'week', 'month']
    range: moment.range(start, end) // Range desribing the current interval start end end date
}
```


Locales and Timezones
---------------------

Ambitus will default to use the globally configured moment constructors. So if you already have your moment constructor set up, Ambitus will do what you want.

If you need Ambitus to use a different time zone or locale than your globally defined one, you can pass in the `moment` configuration option. This should be a function that takes a normal moment input and returns your preferred moment instance.

Examples
~~~~~~~~

**UTC**: `function (input) { return moment(input).utc(); }`
**Danish locale**: `function (input) { return moment(input).locale('da'); }`
**UTC and German locale**: `function (input) { return moment(input).utc().locale('de'); }`

Setting the locale like in these examples requires that the locale you want to switch to is already installed. Please refer to the [moment-timezone documentation](http://momentjs.com/docs/#/i18n/instance-locale/)


Week start and Week number
--------------------------

The first day of a week and week numbering can be configured through the `moment.locale` settings. See the section above


Dependencies
------------
[moment](http://momentjs.com/) and [moment-range](https://github.com/gf3/moment-range). Both can be installed using bower. See [test.html](https://github.com/Munter/ambitus/blob/master/test.html) for example configuration.


License
-------
MIT
