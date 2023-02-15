// Server creation
const routes = require("./routes")
var bodyparser = require('body-parser')

var express = require('express'),
  app = express()
app.use(bodyparser.json())

// create server function for testing
function createServer() {
  app.use(express.json());
  app.use(bodyparser.urlencoded({extended:false}))
  app.use("/", routes)
  return app
}

module.exports = createServer;