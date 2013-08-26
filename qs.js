/**
 * Query string library
 */
var qsjs = {};

(function() {

  'use strict';

  qsjs.debug = true;
  qsjs.current_querystring = null;

  /**
   * Add a value to the browser's current query string.
   *
   * Note that this does NOT update the query string in the browser. It updates
   * the internal represenation of the query string that can be used later.
   *
   * @see QueryString.add
   */
  qsjs.add = function(item_key, item_value, options) {
    if (!qsjs.current_querystring) {
      qsjs.current_querystring = qsjs.parse();
    }

    return qsjs.current_querystring.add(item_key, item_value, options);
  };

  /**
   * Get the value of the item from the browser querystring.
   *
   * Returns false if it is not set.
   *
   * @see QueryString.get
   */
  qsjs.get = function(item) {
    if (!qsjs.current_querystring) {
      qsjs.current_querystring = qsjs.parse();
    }

    return qsjs.current_querystring.get(item);
  };

  /**
   * Debug aware debugging
   */
  qsjs.log = function() {
    // only if we are in debug mode
    if (!this.debug) { return; }

    // only if we have console.log
    if (typeof console !== 'undefined' && typeof console.log !== 'undefined') {
      console.log.apply(console, arguments);
    }
  };

  /**
   * Parse a querystring
   */
  qsjs.parse = function(querystring, options) {
    var this_options = {
      squash_multiple_items: true
    };

    if (typeof querystring === 'object' && !querystring instanceof String && typeof options === 'undefined') {
      options = querystring;
    }

    if ((typeof querystring === 'undefined' || (typeof querystring !== 'undefined' && querystring === null)) && typeof window !== 'undefined') {
      querystring = window.location.search;
    }

    for (var item in options) {
      if (options.hasOwnProperty(item)) {
        this_options[item] = options[item];
      }
    }

    this.log('qsjs.parse', querystring, options);
    var parsed = new qsjs.QueryString(),
      item_key = '',
      item_value = '',
      parse_state = 'key';

    for (var letter in querystring) {
      this.log('qsjs.parse', querystring[letter], item_key, item_value);

      // if the first letter is ?, skip it
      if (parseInt(letter, 10) === 0 && querystring[letter] == '?') {
        continue;
      }

      // switch states when we find a "="
      if (parse_state == 'key' && querystring[letter] == '=') {
        parse_state = 'value';
        continue;
      }
      else if (parse_state == 'value' && querystring[letter] == '&') {
        parse_state = 'key';
        parsed.add(item_key, item_value, {decode: true, squash: this_options.squash_multiple_items});
        item_key = '';
        item_value = '';
        continue;
      }

      if (parse_state == 'key') {
        item_key += querystring[letter];
      }
      else if (parse_state == 'value') {
        item_value += querystring[letter];
      }
    }

    if (item_key !== '') {
      parsed.add(item_key, item_value, {decode: true, squash: this_options.squash_multiple_items});
    }

    return parsed;
  };

  qsjs.remove = function(item) {
    if (!qsjs.current_querystring) {
      qsjs.current_querystring = qsjs.parse();
    }

    return qsjs.current_querystring.remove(item);
  };

  /**
   * Parsed querystring class
   */
  qsjs.QueryString = function() {
    this.items = {};
  };

  /**
   * Add a value to the querystring
   *
   * Options:
   *
   * - decode: decode the value field with decodeURIComponent. default = false
   * - squash: multiple items in the querystring become a single value (last value wins). default = true
   *
   * @param {string} key
   * @param {string} value
   * @param {object} options
   */
  qsjs.QueryString.prototype.add = function(key, value, options) {
    qsjs.log('qsjs.add', key, value, options);
    var this_options = {
      decode: false,
      squash: true
    };

    if (typeof options !== 'undefined') {
      for (var item in options) {
        if (options.hasOwnProperty(item)) {
          this_options[item] = options[item];
        }
      }
    }

    if (this_options.decode) {
      value = decodeURIComponent(value);
    }
    qsjs.log(this_options);

    // item does not exist, or we're squashing existing values
    if (typeof this.items[key] === 'undefined' || this_options.squash) {
      this.items[key] = value;
    }
    else {
      if (typeof this.items[key].push === 'undefined') {
        this.items[key] = [this.items[key], value];
      }
      else {
        this.items[key].push(value);
      }
    }
  };

  /**
   * Remove an item from the querystring
   */
  qsjs.QueryString.prototype.remove = function(item) {
    if (typeof this.items[item] !== 'undefined') {
      delete this.items[item];
    }
    return false;
  };

  /**
   * Get an item or return false
   */
  qsjs.QueryString.prototype.get = function(item) {
    if (typeof this.items[item] !== 'undefined') {
      return this.items[item];
    }
    return false;
  };

  /**
   * Convert the querystring to a string
   */
  qsjs.QueryString.prototype.toString = function() {
    qsjs.log('qsjs.toString', this.items);
    var querystring = [],
      value;
    for (var item in this.items) {
      qsjs.log(item);
      if (this.items.hasOwnProperty(item)) {
        value = this.items[item];
        if (typeof value.push === 'undefined') {
          value = [value];
        }
        for (var v in value) {
          querystring.push(item + '=' + encodeURIComponent(value[v]));
        }
      }
    }

    if (querystring.length === 0) {
      return '';
    }
    return '?' + querystring.join('&');
  };

})();
