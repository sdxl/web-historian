var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  if(req.method === 'GET' && req.url.length === 1){
    var headers = defaultCorsHeaders;
    //return the index.html
    fs.readFile('./public/index.html', function(err, html){
      if(err){
        headers["Content-Type"] = "text/plain";
        res.writeHead(404, headers);
        res.end('Cannot find');
      }else{
        headers["Content-Type"] = "text/html";
        res.writeHead(200, headers);
        res.end(html);
      }
    })
  }
  if(req.method === 'POST'){
    console.log(req.body)
  }

  if(req.method === 'OPTIONS'){
    console.log('you need an option!!!!');
  }

  else {
    headers["Content-Type"] = "text/plain";
    res.writeHead(404, headers);
    res.end('Cannot find');
  }
};
  // res.end(archive.paths.list);

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": "10" //Seconds.
};
