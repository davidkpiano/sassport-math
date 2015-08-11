var sassport = require('sassport');
var math = require('mathjs');
var sass = require('node-sass');
var sassUtils = require('node-sass-utils')(sass);
var _ = require('lodash');

function sassportMathWrapper(mathFunc) {
  return function(args, done) {
    var result = null;
    var jsArgs = [];

    var sassArgs = new Array(args.getLength());

    for (var i = 0; i < args.getLength(); i++) {
      sassArgs[i] = args.getValue(i);
    }

    jsArgs = _.map(sassArgs, mathUnit);

    result = mathFunc.apply(math, jsArgs);

    return sassUtils.castToSass(result);
  }
}

function mathUnit(sassValue) {
  var value = sassUtils.castToJs(sassValue);

  if (sassUtils.typeOf(sassValue) === 'number') {
    try {
      // Attempt to use the provided Sass unit
      value = math.unit(sassValue.getValue(), sassValue.getUnit());
    } catch (e) {
      // Use the unitless value
      value = sassValue.getValue();
    }
  } else {
    value = _.pluck(value, 'value');
  }

  return value;
}

function isFunction(value) {
  return value && Object.prototype.toString.call(value) === '[object Function]';
}

function mapMathFunctions(math) {
  var result = {};

  for (var property in math) {
    if (math.hasOwnProperty(property) && isFunction(math[property])) {
      result['math-' + property + '($args...)'] = sassportMathWrapper(math[property]);
    }
  }

  return result;
}

module.exports = sassport.module('math')
  .functions(mapMathFunctions(math))
  .variables({
    '$PI': math.pi,
    '$TAU': math.tau,
    '$PHI': math.phi,
    '$E': math.E,
    '$LN2': math.LN2,
    '$LN10': math.LN10,
    '$LOG2E': math.LOG2E,
    '$LOG10E': math.LOG10E,
    '$PI': math.PI,
    '$SQRT1_2': math.SQRT1_2,
    '$SQRT2': math.SQRT2
  });