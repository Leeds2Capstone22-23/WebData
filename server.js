var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000;

app.listen(port);

console.log('Web REST API started on port ' + port);

module.exports = app;