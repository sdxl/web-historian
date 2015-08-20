var http = require("http");
var handler = require("./request-handler");
var initialize = require("./initialize.js");
var arch = require("../helpers/archive-helpers.js");

// Why do you think we have this here?
// HINT: It has to do with what's in .gitignore
initialize();

var port = 8080;
var ip = "127.0.0.1";
var server = http.createServer(handler.handleRequest);

if (module.parent) {
  module.exports = server;
} else {
  server.listen(port, ip);
  console.log("Listening on http://" + ip + ":" + port);
}

// console.log("outside", arch.readListOfUrls());
// exports.addUrlToList()

// setTimeout(function(){
//   console.log(exports.paths.list)
// }, 1000)

//
//
//something to make the cron job file run here?
