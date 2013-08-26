/**
 * Tests
 */
(function() {

  test("no querystring", function() {
    var parsed = qsjs.parse('');
    equal(typeof parsed, 'object');
    equal(parsed.toString(), '');
  });

  test("single item", function() {
    var qs = '?item=1',
      parsed = qsjs.parse(qs);
    equal(typeof parsed, 'object');
    equal(parsed.toString(), qs);
  });

  test("single item, encoded", function() {
    var qs = '?item=%24400',
      parsed = qsjs.parse(qs);
    equal(typeof parsed, 'object');
    equal(parsed.toString(), qs);
    equal(parsed.get('item'), '$400');
  });

  test("two items", function() {
    var qs = '?item=1&item2=2',
      parsed = qsjs.parse(qs);
    equal(typeof parsed, 'object');
    equal(parsed.toString(), qs);
  });

  test("squash items by default", function() {
    var qs = '?item=1&item=2',
      parsed = qsjs.parse(qs);
    equal(typeof parsed, 'object');
    console.log(parsed);
    equal(parsed.toString(), '?item=2');
  });

  test("don't squash multiple items", function() {
    var qs = '?item=1&item=2',
      parsed = qsjs.parse(qs, {squash_multiple_items: false});
    equal(typeof parsed, 'object');
    console.log(parsed);
    equal(parsed.toString(), '?item=1&item=2');
  });

  test("remove item", function() {
    var qs = '?item=1',
      parsed = qsjs.parse(qs);
    equal(typeof parsed, 'object');
    parsed.remove('item');
    console.log('string', parsed.toString());
    equal(parsed.toString(), '');
  });

  test("remove from two items", function() {
    var qs = '?item=1&item2=2',
      parsed = qsjs.parse(qs);
    equal(typeof parsed, 'object');
    parsed.remove('item2');
    equal(parsed.toString(), '?item=1');
  });

  test("add after parse", function() {
    var qs = '?item=1',
      parsed = qsjs.parse(qs);
    equal(typeof parsed, 'object');
    parsed.add('item2', 2);
    equal(parsed.toString(), '?item=1&item2=2');
  });

})();