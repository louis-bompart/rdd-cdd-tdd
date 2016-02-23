var assert = require('assert'),
    config = require('./../lib/config');

var units = {
      thingy: 42,
      stuffy: 428
    },
    ip = '4587';

var Config = config(units, ip);

describe('Config', function () {
    it('has 3 props',function () {
      assert(Object.keys(Config).length === 3);
    });
    it('has "units" as prop',function () {
      assert(Object.keys(Config).indexOf('units')>-1);
    });
    it('has "ip" as prop',function () {
      assert(Object.keys(Config).indexOf('ip')>-1);
    });
    it('has "args" as prop',function () {
      assert(Object.keys(Config).indexOf('args')>-1);
    });
    it('after construction, 2 props are populated',function () {
      var nbPopulated = 0;
      var props = Object.keys(Config);
      props.forEach(function (key) {
        if (key!= null || key != '') {
          nbPopulated++;
        }
      });
      assert(nbPopulated,2);
    });
    it('has correct key types',function () {
      var isCorrect = true;
      var props = Object.keys(Config);
      props.forEach(function (key) {
        isCorrect = (typeof(key) === 'object' || typeof(key) === 'string');
      });
      assert(isCorrect);
    })
});
