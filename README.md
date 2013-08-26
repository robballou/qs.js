# qs.js

A library for interacting with and manipulating query strings.

## Examples

To check the value of a query string for a given page:

    // Returns the value of "item" from the query string. Returns false if it's not present
    var item_value = qsjs.get('item');

You can add and remove values from the query string too. In the case of the browser, this does not update the window's location at all. This updates the internal representation of the query string.

    // remove the 'item' key from the query string
    qsjs.remove('item');

    // add a 'search' key to the query string
    qsjs.add('search', 'test');

By default, the `.add` method does not decode values. If you want to decode values, you can pass that in as an option:

    qsjs.add('price', '%24400', {decode: true});

You can also parse query strings that you may have on links or other strings:

    var querystring = qsjs.parse('?example=1234');

If you have manipulated a querystring, you can convert it back to a string:

    var new_querystring = querystring.toString();

## Tests

You can [view the tests here](http://robballou.com/p/qsjs/test.html).