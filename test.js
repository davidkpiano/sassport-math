var sassport = require('sassport');
var sassportMath = require('./index.js');

sassport([sassportMath]).render({
  file: './test.scss'
}, function(err, res) {
  console.log(err);
  console.log(res.css.toString());
});