Ambitus
=======

A stateful calendar control module providing intuitive range switching and navigation.

Ambitus can be used to control standard calendar UIs that expose day/week/month views with functions to navigate to the next and previous inervals and to return to today.

The aim is to provide a user experience that shows the expected range, no matter what date interval size the user navigates or switches to. When switching from a bigger interval to a smaller one, the first day of the bigger is chosen and the wanted range that includes is returned. When switching from a smaller to a bigger range Ambitus tries to return to the previous selected one if there is a range overlap with the smaller one. The concept of 'today' is given special significance when switching interval size.

All methods in Ambitus return a date range object provided by [moment-range](https://github.com/gf3/moment-range), which provide you with all the richness of [moment](http://momentjs.com/) date object and some aditional range methods for your convenience.


Usage
-----

``` javascript
var cal = new Ambitus();
var range = cal.interval('month'); // Chose month interval (default)

console.log(range); // This month
console.log(cal.next()); // Next month
console.log(cal.previous()); // This month
console.log(cal.interval('week')); // This week
```


Configuration
-------------

``` javascript
new Ambitus({
    ignoreToday: false, // Boolean, default false. Give special meaning to todays date when changing interval size down
    interval: 'month', // String, values: 'day', 'week', 'month', default 'month'.
    onBeforeChange: function (newState, oldState) {
        console.log(newState); // { interval: 'month', range: moment().range(start, end) }
        console.log(oldState); // { interval: 'month', range: moment().range(start, end) }

        return true; // return false to block the change
    },
    onChange: function (newState, oldState) {
        console.log(newState); // { interval: 'month', range: moment().range(start, end) }
        console.log(oldState); // { interval: 'month', range: moment().range(start, end) }
    }
});
```


Dependencies
------------
[moment](http://momentjs.com/) and [moment-range](https://github.com/gf3/moment-range). Both can be installed using bower. See [test.html](https://github.com/Munter/ambitus/blob/master/test.html) for example configuration.


Todo
----

 * Config: UTC dates
 * Config: First day of week


License
-------
MIT


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/Munter/ambitus/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

